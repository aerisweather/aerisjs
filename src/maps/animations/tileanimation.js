define([
  'aeris/util',
  'aeris/maps/animations/abstractanimation',
  'aeris/maps/animations/helpers/animationlayerloader',
  'aeris/promise',
  'aeris/errors/invalidargumenterror',
  'aeris/util/findclosest'
], function(_, AbstractAnimation, AnimationLayerLoader, Promise, InvalidArgumentError, findClosest) {
  /**
   * Animates a single {aeris.maps.layers.AerisTile} layer.
   *
   * @publicApi
   * @class aeris.maps.animations.TileAnimation
   * @constructor
   * @extends aeris.maps.animations.AbstractAnimation
   *
   * @param {aeris.maps.layers.AerisTile} layer The layer to animate.
   * @param {aeris.maps.animations.options.AnimationOptions} opt_options
   * @param {number} opt_options.timestep Time between animation frames, in milliseconds.
   * @param {aeris.maps.animations.helpers.AnimationLayerLoader=} opt_options.animationLayerLoader
   */
  var TileAnimation = function(layer, opt_options) {
    var options = _.defaults(opt_options || {}, {
      AnimationLayerLoader: AnimationLayerLoader
    });

    AbstractAnimation.call(this, options);


    /**
     * The original layer object, which will serve as
     * the 'master' for all animation layer "frames."
     *
     * @type {aeris.maps.layers.AerisTile}
     * @private
     * @property masterLayer_
     */
    this.masterLayer_ = layer;


    /**
     * @property currentLayer_
     * @private
     * @type {?aeris.maps.layers.AerisTile}
     */
    this.currentLayer_ = null;


    /**
     * A hash of {aeris.maps.layers.AerisTile},
     * listed by timestamp.
     *
     * @type {Object.<number,aeris.maps.layers.AerisTile>}
     * @private
     * @property layersByTime_
     */
    this.layersByTime_ = {};


    /**
     * An array of available timestamps.
     *
     * @type {Array.number}
     * @private
     * @property times_
     */
    this.times_ = [];


    /**
     * animationLayerLoader constructor.
     *
     * @property AnimationLayerLoader_
     * @type {function():aeris.maps.animations.helpers.AnimationLayerLoader}
     * @protected
     */
    this.AnimationLayerLoader_ = options.AnimationLayerLoader;


    // Helper for creating and loading animation layer 'frames'
    this.animationLayerLoader_ = new this.AnimationLayerLoader_(this.masterLayer_, {
      from: this.from_,
      to: this.to_,
      limit: this.limit_
    });


    // Convert the master layer into a "dummy" view model,
    // with no bound rendering behavior.
    //
    // This will allow the client to manipulate the master layer
    // as a proxy for all other animation frames, without actually
    // showing the layer on the map.
    //
    this.masterLayer_.removeStrategy();

    // Load all the tile layers for the animation
    this.loadAnimationLayers();

    // Bind the layer loader to the animations time bounds
    this.listenTo(this, 'change:to change:from', function() {
      this.animationLayerLoader_.setTo(this.to_);
      this.animationLayerLoader_.setFrom(this.from_);
    });
  };
  _.inherits(TileAnimation, AbstractAnimation);

  /**
   * @property DEFAULT_TIME_TOLERANCE_
   * @static
   * @type {number}
   * @private
   */
  TileAnimation.DEFAULT_TIME_TOLERANCE_ = 1000 * 60 * 60 * 2; // 2 hours

  /**
   * Load the tile layers for the animation.
   *
   * @return {aeris.Promise} Promise to load all layers.
   * @method loadAnimationLayers
   */
  TileAnimation.prototype.loadAnimationLayers = function() {
    this.bindLoadEventsTo_(this.animationLayerLoader_);

    // When layers have loaded, set them up for animating
    this.animationLayerLoader_.once('load:times', function(times, layersByTime) {
      this.setLayersByTime_(layersByTime);
      this.refreshCurrentLayer_();

      this.trigger('load:times', times, layersByTime);
    }, this);

    // Start loading layers
    return this.animationLayerLoader_.load().
      fail(function(err) {
        throw err;
      });
  };

  /**
   * @method preload
   */
  TileAnimation.prototype.preload = function() {
    var promiseToPreload = new Promise();
    var mapToUseForPreloading = this.masterLayer_.getMap();

    // We need our times (and timeLayers)
    // to be loaded, before we can preload layers
    this.whenTimesAreLoaded_().
      done(function() {
        var layers = _.values(this.layersByTime_);

        // Preload each layer in sequece
        Promise.sequence(layers, function(layer) {
          return layer.preload(mapToUseForPreloading);
        }).
          done(promiseToPreload.resolve).
          fail(promiseToPreload.reject);
      }, this).
      fail(promiseToPreload.reject);

    return promiseToPreload;
  };


  /**
   * Preloads a single tile layer.
   *
   * @method preloadLayer_
   * @private
   * @param {aeris.maps.layers.AerisTile} layer
   * @return {aeris.Promise} Promise to load the layer
   */
  TileAnimation.prototype.preloadLayer_ = function(layer) {
    return layer.preload(this.masterLayer_.getMap());
  };


  /**
   * @method whenTimesAreLoaded_
   * @private
   * @return {aeris.Promise} A promise to load tile layer times.
   *                         Resolves immediately if times are already loaded.
   */
  TileAnimation.prototype.whenTimesAreLoaded_ = function() {
    var promiseToLoadTimes = new Promise();
    var areTimesLoaded = !!this.times_.length;

    if (areTimesLoaded) {
      promiseToLoadTimes.resolve(this.getTimes());
    }
    else {
      this.listenToOnce(this, {
        'load:times': promiseToLoadTimes.resolve.
          bind(promiseToLoadTimes),
        'load:error': promiseToLoadTimes.reject.
          bind(promiseToLoadTimes)
      });
    }

    return promiseToLoadTimes;
  };



  /**
   * @method refreshCurrentLayer_
   * @private
   */
  TileAnimation.prototype.refreshCurrentLayer_ = function() {
    this.goToTime(this.getCurrentTime());
  };


  /**
   * Animates to the layer at the next available time,
   * or loops back to the start.
   * @method next
   */
  TileAnimation.prototype.next = function() {
    var nextTime = this.getNextTime_();

    if (!nextTime) {
      return;
    }

    this.goToTime(nextTime);
  };


  /**
   * Animates to the previous layer,
   * or loops back to the last layer.
   * @method previous
   */
  TileAnimation.prototype.previous = function() {
    var prevTime = this.getPreviousTime_();

    if (!prevTime) {
      return;
    }

    this.goToTime(prevTime);
  };


  /**
   * Animates to the layer at the specified time.
   *
   * If no layer exists at the exact time specified,
   * will use the closest available time.
   *
   * @param {number|Date} time UNIX timestamp or date object.
   * @method goToTime
   */
  TileAnimation.prototype.goToTime = function(time) {
    var nextLayer;
    var currentLayer;
    var haveTimesBeenLoaded = !!this.getTimes().length;

    time = _.isDate(time) ? time.getTime() : time;

    if (!_.isNumeric(time)) {
      throw new InvalidArgumentError('Invalid animation time: time must be a Date or a timestamp (number).');
    }

    currentLayer = this.getCurrentLayer();
    // Note that we may not be able to find a layer in the same tense,
    // in which case this value is null.
    nextLayer = this.getLayerForTimeInSameTense_(time) || null;

    // Set the new layer
    this.currentTime_ = time;

    if (nextLayer === currentLayer) {
      return;
    }

    // If no time layers have been created
    // wait for time layers to be created,
    // then try again. Otherwise, our first
    // frame will  never show.
    if (!haveTimesBeenLoaded) {
      this.listenToOnce(this, 'load:times', function() {
        this.goToTime(this.getCurrentTime());
      });
    }

    if (nextLayer) {
      this.transition_(currentLayer, nextLayer);
    }
    else if (currentLayer) {
      this.transitionOut_(currentLayer);
    }

    this.currentLayer_ = nextLayer;
    this.trigger('change:time', new Date(this.currentTime_));
  };


  /**
   * @return {number} Percentage complete loading tile (1.0 is 100% complete).
   * @method getLoadProgress
   */
  TileAnimation.prototype.getLoadProgress = function() {
    return this.animationLayerLoader_.getLoadProgress();
  };


  /**
   * @method hasMap
   */
  TileAnimation.prototype.hasMap = function() {
    return this.masterLayer_.hasMap();
  };


  /**
   * Destroys the tile animation object,
   * clears animation frames from memory.
   *
   *
   * @method destroy
   */
  TileAnimation.prototype.destroy = function() {
    _.invoke(this.layersByTime_, 'destroy');
    this.layersByTime_ = {};
    this.times_.length = 0;

    this.stopListening();

    this.masterLayer_.resetStrategy();
  };


  /**
   * Returns available times.
   * Note that times are loaded asynchronously from the
   * Aeris Interactive Tiles API, so they will not be immediately
   * available.
   *
   * Wait for the 'load:times' event to fire before attempting
   * to grab times.
   *
   * @return {Array.<number>} An array timestamps for which
   *                          they are available tile frames.
   * @method getTimes
   */
  TileAnimation.prototype.getTimes = function() {
    return _.clone(this.times_);
  };


  /**
   * @method bindLoadEventsTo_
   * @private
   * @param {aeris.maps.animations.helpers.AnimationLayerLoader} layerLoader
   */
  TileAnimation.prototype.bindLoadEventsTo_ = function(layerLoader) {
    // Proxy load events from AnimationLayerLoader
    var proxyLayerLoaderEvents = _.partial(this.proxyEvent_, layerLoader);

    _.each([
      'load:progress',
      'load:complete',
      'load:error',
      'load:reset'
    ], proxyLayerLoaderEvents, this);
  };


  /**
   * @method proxyEvent_
   * @param {aeris.Events} target
   * @param {string} eventName
   * @private
   */
  TileAnimation.prototype.proxyEvent_ = function(target, eventName) {
    this.listenTo(target, eventName, function(var_args) {
      var args = _.argsToArray(arguments);
      this.trigger.apply(this, [eventName].concat(args));
    });
  };


  /**
   * Set the layer "frames" to animate.
   *
   * @method setLayersByTime_
   * @param {Object.<number,aeris.maps.layers.AerisTile>} timeLayers Hash of timestamp --> layer
   * @private
   */
  TileAnimation.prototype.setLayersByTime_ = function(timeLayers) {
    this.layersByTime_ = timeLayers;
    this.times_ = this.getOrderedTimesFromLayers_(timeLayers);
  };


  /**
   *
   * @param {Object.<number, aeris.maps.layers.AerisTile>} timeLayers
   * @return {Array.<Number>}
   * @private
   */
  TileAnimation.prototype.getOrderedTimesFromLayers_ = function(timeLayers) {
    var times = _.map(_.keys(timeLayers), function(time) {
      return parseInt(time);
    });
    return _.sortBy(times, _.identity);
  };


  /**
   * @method getLayerForTime_
   * @param {Number} time
   * @return {aeris.maps.layers.AerisTile}
   * @private
   */
  TileAnimation.prototype.getLayerForTime_ = function(time) {
    return this.layersByTime_[this.getClosestTime_(time)];
  };


  /**
   * @method getLayerForTimeInSameTense_
   * @private
   * @param {Number} time
   * @return {aeris.maps.layers.AerisTile}
   */
  TileAnimation.prototype.getLayerForTimeInSameTense_ = function(time) {
    return this.layersByTime_[this.getClosestTimeInSameTense_(time)];
  };


  /**
   * Returns the closes available time.
   *
   * @param {number} targetTime UNIX timestamp.
   * @param {Array.<Number>} opt_times Defaults to loaded animation times.
   * @return {number}
   * @private
   * @method getClosestTime_
   */
  TileAnimation.prototype.getClosestTime_ = function(targetTime, opt_times) {
    var times = opt_times || this.times_;
    return findClosest(targetTime, times);
  };


  /**
   * Returns the closes available time.
   *
   * If provided time is in the past, will return
   * the closest past time (and vice versa);
   *
   * @method getClosestTimeInSameTense_
   * @private
   *
   * @param {number} targetTime UNIX timestamp.
   * @param {Array.<Number>} opt_times Defaults to loaded animation times.
   * @return {number}
   */
  TileAnimation.prototype.getClosestTimeInSameTense_ = function(targetTime, opt_times) {
    var isTargetInFuture = targetTime > Date.now();
    var times = opt_times || this.times_;

    // Only look at times that are in the past, if
    // the target is in the past, and vice versa.
    var timesInSameTense = times.filter(function(time) {
      var isTimeInFuture = time > Date.now();
      var isTimeInSameTenseAsTarget = isTimeInFuture && isTargetInFuture || !isTimeInFuture && !isTargetInFuture;

      return isTimeInSameTenseAsTarget;
    });

    return findClosest(targetTime, timesInSameTense);
  };


  /**
   * Transition from one layer to another.
   *
   * @param {?aeris.maps.layers.AerisTile} opt_oldLayer
   * @param {aeris.maps.layers.AerisTile} newLayer
   * @private
   * @method transition_
   */
  TileAnimation.prototype.transition_ = function(opt_oldLayer, newLayer) {


    // If the new layer is not yet loaded,
    // wait to transition until it is.
    // This prevents displaying an "empty" tile layer,
    // and makes it easier to start animations before all
    // layers are loaded.
    if (!newLayer.isLoaded()) {
      this.preloadLayer_(newLayer);
      this.transitionWhenLoaded_(opt_oldLayer, newLayer);
    }


    // Hide all the layers
    // Sometime we have trouble with old layers sticking around.
    // especially when we need to reload layers for new bounds.
    // This a fail-proof way to handle that issue.
    _.without(this.layersByTime_, newLayer).
      forEach(this.transitionOut_, this);

    this.transitionInClosestLoadedLayer_(newLayer);
  };


  /**
   * @param {aeris.maps.layers.AerisTile} layer
   * @method transitionIn_
   * @private
   */
  TileAnimation.prototype.transitionIn_ = function(layer) {
    this.syncLayerToMaster_(layer);
  };


  /**
   * @param {aeris.maps.layers.AerisTile} layer
   * @method transitionOut_
   * @private
   */
  TileAnimation.prototype.transitionOut_ = function(layer) {
    layer.stopListening(this.masterLayer_);
    layer.setOpacity(0);
  };


  /**
   * Handle transition for a layer which has not yet
   * been loaded
   *
   * @param {?aeris.maps.layers.AerisTile} opt_oldLayer
   * @param {aeris.maps.layers.AerisTile} newLayer
   * @method transitionWhenLoaded_
   * @private
   */
  TileAnimation.prototype.transitionWhenLoaded_ = function(opt_oldLayer, newLayer) {
    // Clear any old listeners from this transition
    // (eg. if transition is called twice for the same layer)
    this.stopListening(newLayer, 'load');
    this.listenToOnce(newLayer, 'load', function() {
      if (this.getCurrentLayer() === newLayer) {
        this.transition_(opt_oldLayer, newLayer);
      }
    });
  };


  /**
   * @method transitionInClosestLoadedLayer_
   * @private
   */
  TileAnimation.prototype.transitionInClosestLoadedLayer_ = function(layer) {
    var loadedTimes = _.keys(this.layersByTime_).filter(function(time) {
      return this.layersByTime_[time].isLoaded();
    }, this);
    var closestLoadedTime = this.getClosestTimeInSameTense_(layer.get('time').getTime(), loadedTimes);

    if (!closestLoadedTime) {
      return;
    }


    this.transitionIn_(this.layersByTime_[closestLoadedTime]);
  };


  /**
   * @method getTimeDeviation_
   * @private
   * @param {number} time
   * @return {number} The difference the provided time, and the closest available time.
   */
  TileAnimation.prototype.getTimeDeviation_ = function(time) {
    return Math.abs(time - this.getClosestTime_(time));
  };


  /**
   * @method getLargestInterval_
   * @private
   * @param {Array.<number>} numbers
   */
  TileAnimation.prototype.getLargestInterval_ = function(numbers) {
    var lastTime, sortedTimes;

    // No intervals exist
    if (numbers.length < 2) {
      return 0;
    }

    lastTime = numbers[0];
    sortedTimes = _.sortBy(numbers, _.identity);

    return sortedTimes.reduce(function(interval, time) {
      var currentInterval = Math.abs(time - lastTime);

      lastTime = time;

      return Math.max(interval, currentInterval);
    }, 0);
  };


  /**
   * Update the attributes of the provided layer
   * to match those of the master layer.
   *
   * @method syncLayerToMaster_
   * @private
   * @param  {aeris.maps.layers.AerisTile} layer
   */
  TileAnimation.prototype.syncLayerToMaster_ = function(layer) {
    var boundAttrs = [
      'map',
      'opacity',
      'zIndex'
    ];

    // clear any old bindings
    layer.stopListening(this.masterLayer_);

    layer.bindAttributesTo(this.masterLayer_, boundAttrs);
  };


  TileAnimation.prototype.getCurrentLayer = function() {
    return this.currentLayer_;
  };


  TileAnimation.prototype.getNextTime_ = function() {
    return this.isCurrentLayerLast_() ?
      this.times_[0] : this.times_[this.getLayerIndex_() + 1];
  };


  TileAnimation.prototype.getPreviousTime_ = function() {
    var lastTime = _.last(this.times_);
    return this.isCurrentLayerFirst_() ?
      lastTime : this.times_[this.getLayerIndex_() - 1];
  };

  /**
   * @method isCurrentLayer_
   * @private
   * @param {aeris.maps.layers.AerisTile} layer
   * @return {Boolean}
   */
  TileAnimation.prototype.isCurrentLayer_ = function(layer) {
    return layer === this.getCurrentLayer();
  };


  /**
   * @return {boolean} True, if the current layer is the first frame.
   * @private
   * @method isCurrentLayerFirst_
   */
  TileAnimation.prototype.isCurrentLayerFirst_ = function() {
    return this.getLayerIndex_() === 0;
  };


  /**
   * @return {boolean} True, if the current layer is the last frame.
   * @private
   * @method isCurrentLayerLast_
   */
  TileAnimation.prototype.isCurrentLayerLast_ = function() {
    return this.getLayerIndex_() === this.times_.length - 1;
  };


  /**
   * Returns the index of the current layer
   * within this.times_.
   *
   * @return {number}
   * @private
   * @method getLayerIndex_
   */
  TileAnimation.prototype.getLayerIndex_ = function() {
    var timeOfCurrentLayer = this.getClosestTime_(this.currentTime_);
    return this.times_.indexOf(timeOfCurrentLayer);
  };


  return _.expose(TileAnimation, 'aeris.maps.animations.TileAnimation');
});
