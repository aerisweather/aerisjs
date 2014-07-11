define([
  'aeris/util',
  'aeris/maps/animations/abstractanimation',
  'aeris/maps/animations/helpers/animationlayerloader',
  'aeris/errors/invalidargumenterror',
  'aeris/util/findclosest'
], function(_, AbstractAnimation, AnimationLayerLoader, InvalidArgumentError, findClosest) {
  /**
   * Animates a single {aeris.maps.layers.AerisTile} layer.
   *
   * @publicApi
   * @class TileAnimation
   * @namespace aeris.maps.animations
   * @constructor
   * @extends aeris.maps.animations.AbstractAnimation
   *
   * @param {aeris.maps.layers.AerisTile} layer The layer to animate.
   * @param {aeris.maps.animations.options.AnimationOptions} opt_options
   * @param {number} opt_options.timestep Time between animation frames, in milliseconds.
   * @param {aeris.maps.animations.helpers.AnimationLayerLoader=} opt_options.animationLayerLoader
   * @param {number=} opt_options.timeTolerance When the time is set on a TileAnimation, the animation object will
   *        find and display the animation layer with the closest timestamp. However, if the closest available layer is
   *        more than `timeTolerance` ms away from the set time, the layer will not be displayed. Defaults to 2 hours.
   */
  var TileAnimation = function(layer, opt_options) {
    var options = _.defaults(opt_options || {}, {
      // Defaults will be set after times are loaded.
      from: _.now() - (1000 * 60 * 60 * 2), // two hours ago
      to: _.now(),
      limit: 20,
      AnimationLayerLoader: AnimationLayerLoader,
      timeTolerance: 1000 * 60 * 60 * 2   // 2 hours
    });


    /**
     * @property timeTolerance_
     * @private
     * @type {number} In milliseconds.
     */
    this.timeTolerance_ = options.timeTolerance;


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
     * @property timeLayers_
     */
    this.timeLayers_ = {};


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


    /**
     * Helper for creating and loading animation layer 'frames'
     *
     * @property animationLayerLoader_
     * @protected
     * @type {aeris.maps.animations.helpers.AnimationLayerLoader}
     */
    this.animationLayerLoader_ = this.createAnimationLayerLoader_();


    this.prepareMasterLayer_();
    this.loadAnimationLayers();

    this.listenTo(this, 'change:to change:from', function() {
      this.animationLayerLoader_.setTo(this.to_);
      this.animationLayerLoader_.setFrom(this.from_);
    });
  };
  _.inherits(TileAnimation, AbstractAnimation);


  /**
   * @method createAnimationLayerLoader_
   * @protected
   */
  TileAnimation.prototype.createAnimationLayerLoader_ = function() {
    return new this.AnimationLayerLoader_(this.masterLayer_, {
      from: this.from_,
      to: this.to_,
      limit: this.limit_
    });
  };


  /**
   * Load the tile layers for the animation.
   *
   * @return {aeris.Promise} Promise to load all layers.
   * @method loadAnimationLayers
   */
  TileAnimation.prototype.loadAnimationLayers = function() {
    this.bindLoadEventsTo_(this.animationLayerLoader_);

    this.animationLayerLoader_.once('load:times', function(times, timeLayers) {
      this.setTimeLayers_(timeLayers);
      this.refreshCurrentLayer_();

      this.trigger('load:times', times, timeLayers);
    }, this);

    return this.animationLayerLoader_.load().
      fail(function(err) {
        throw err;
      });
  };


  /**
   * Convert master layer into a "dummy" view model,
   * with no bound rendering behavior.
   *
   * This will allow the client to manipulate the master layer
   * as a proxy for all other animation frames, without actually
   * showing the layer on the map.
   *
   * @method prepareMasterLayer_
   * @private
   */
  TileAnimation.prototype.prepareMasterLayer_ = function() {
    // Destroy its strategy, so changes to its state is not rendered
    this.masterLayer_.removeStrategy();
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


    // If no time layers have been created
    // wait for time layers to be created,
    // then try again. Otherwise, our first
    // frame will  never show.
    if (!haveTimesBeenLoaded) {
      this.listenToOnce(this, 'load:times', function() {
        this.goToTime(this.getCurrentTime());
      });
    }

    if (currentLayer && nextLayer) {
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
   * Destroys the tile animation object,
   * clears animation frames from memory.
   *
   *
   * @method destroy
   */
  TileAnimation.prototype.destroy = function() {
    _.invoke(this.timeLayers_, 'destroy');
    this.timeLayers_ = {};
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
   * @method setTimeLayers_
   * @param {Object.<number,aeris.maps.layers.AerisTile>} timeLayers Hash of timestamp --> layer
   * @private
   */
  TileAnimation.prototype.setTimeLayers_ = function(timeLayers) {
    this.timeLayers_ = timeLayers;
    this.times_ = this.getOrderedTimesFromLayers_(timeLayers);
  };


  /**
   * Some mapping libraries will not load a layer
   * until it has been set to the map.
   *
   * This method silently and temporarily sets a layer to the map,
   * to make sure loading is initialized.
   *
   * @method preloadTimeLayer_
   * @private
   * @param {aeris.maps.layers.AerisTile} layer
   */
  TileAnimation.prototype.preloadTimeLayer_ = function(layer) {
    if (layer.isLoaded()) {
      return;
    }
    var triggerLayerLoad = (function() {
      layer.set({
        // Temporarily set to 0 opacity, so we don't see
        // the layer being added to the map
        opacity: 0,

        // Trigger loading, by setting to the map
        map: this.masterLayer_.getMap()
      });
    }).bind(this);

    // Prevent layer initialization from
    // blocking the call stack.
    // (this is a CPU intensive method)
    var triggerLayerLoad_non_blocking = _.throttle(function() {
      _.defer(triggerLayerLoad);
    }, 10);

    if (this.masterLayer_.hasMap()) {
      triggerLayerLoad_non_blocking();
    }
    else {
      this.listenTo(this.masterLayer_, 'map:set', triggerLayerLoad_non_blocking);
    }
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
    return this.timeLayers_[this.getClosestTime_(time)];
  };


  /**
   * @method getLayerForTimeInSameTense_
   * @private
   * @param {Number} time
   * @return {aeris.maps.layers.AerisTile}
   */
  TileAnimation.prototype.getLayerForTimeInSameTense_ = function(time) {
    return this.timeLayers_[this.getClosestTimeInSameTense_(time)];
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
   * @param {aeris.maps.layers.AerisTile} oldLayer
   * @param {aeris.maps.layers.AerisTile} newLayer
   * @private
   * @method transition_
   */
  TileAnimation.prototype.transition_ = function(oldLayer, newLayer) {
    var isWithinTimeTolerance;


    // If the new layer is not yet loaded,
    // wait to transition until it is.
    // This prevents displaying an "empty" tile layer,
    // and makes it easier to start animations before all
    // layers are loaded.
    if (!newLayer.isLoaded()) {
      this.preloadTimeLayer_(newLayer);
      this.transitionWhenLoaded_(oldLayer, newLayer);
    }


    // Hide all the layers
    // Sometime we have trouble with old layers sticking around.
    // especially when we need to reload layers for new bounds.
    // This a fail-proof way to handle that issue.
    _.without(this.timeLayers_, newLayer).
      forEach(this.transitionOut_, this);

    isWithinTimeTolerance = this.getTimeDeviation_(this.currentTime_) < this.timeTolerance_;
    if (isWithinTimeTolerance) {
      this.transitionInClosestLoadedLayer_(newLayer);
    }
    else {
      this.transitionOut_(newLayer);
    }
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
   * @param {aeris.maps.layers.AerisTile} oldLayer
   * @param {aeris.maps.layers.AerisTile} newLayer
   * @method transitionWhenLoaded_
   * @private
   */
  TileAnimation.prototype.transitionWhenLoaded_ = function(oldLayer, newLayer) {
    // Clear any old listeners from this transition
    // (eg. if transition is called twice for the same layer)
    this.stopListening(newLayer, 'load');
    this.listenToOnce(newLayer, 'load', function() {
      if (this.getCurrentLayer() === newLayer) {
        this.transition_(oldLayer, newLayer);
      }
    });
  };


  /**
   * @method transitionInClosestLoadedLayer_
   * @private
   */
  TileAnimation.prototype.transitionInClosestLoadedLayer_ = function(layer) {
    var loadedTimes = _.keys(this.timeLayers_).filter(function(time) {
      return this.timeLayers_[time].isLoaded();
    }, this);
    var closestLoadedTime = this.getClosestTimeInSameTense_(layer.get('time').getTime(), loadedTimes);

    if (!closestLoadedTime) {
      return;
    }


    this.transitionIn_(this.timeLayers_[closestLoadedTime]);
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


  /**
   * @method setTimeTolerance
   * @param {number} tolerance
   */
  TileAnimation.prototype.setTimeTolerance = function(tolerance) {
    this.timeTolerance_ = tolerance;
    this.goToTime(this.currentTime_);
  };


  return _.expose(TileAnimation, 'aeris.maps.animations.TileAnimation');
});
