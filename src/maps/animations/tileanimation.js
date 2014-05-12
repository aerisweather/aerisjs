define([
  'aeris/util',
  'aeris/maps/animations/abstractanimation',
  'aeris/maps/animations/helpers/animationlayerloader',
  'aeris/errors/invalidargumenterror'
], function(_, AbstractAnimation, AnimationLayerLoader, InvalidArgumentError) {
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
   */
  var TileAnimation = function(layer, opt_options) {
    var options = _.defaults(opt_options || {}, {
      // Defaults will be set after times are loaded.
      from: 0,
      to: new Date().getTime(),
      limit: 20,
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
      this.updateTimeBounds_();
      this.trigger('load:times', times, timeLayers);

      this.showInitialAnimationFrame_();
    }, this);

    return this.animationLayerLoader_.load();
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
   * @method showInitialAnimationFrame_
   * @private
   */
  TileAnimation.prototype.showInitialAnimationFrame_ = function() {
    var initialTime = this.to_;
    var lastLayer = this.getLayerForTime_(initialTime);

    this.goToTime(initialTime);
    this.syncLayerToMaster_(lastLayer);
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

    time = _.isDate(time) ? time.getTime() : time;

    if (!_.isNumeric(time)) {
      throw new InvalidArgumentError('Invalid animation time: time must be a Date or a timestamp (number).');
    }

    nextLayer = this.getLayerForTime_(time);

    // Only transition if the layer is loaded
    // to prevent gaps in animation.
    if (nextLayer && nextLayer !== this.getCurrentLayer() && nextLayer.isLoaded()) {
      this.transition_(this.getCurrentLayer(), nextLayer);
    }

    // Set the new layer
    this.currentTime_ = time;

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

    _.each(timeLayers, this.initializeLayerLoading_, this);
  };


  /**
   * Some mapping libraries will not load a layer
   * until it has been set to the map.
   *
   * This method silently and temporarily sets a layer to the map,
   * to make sure loading is initialized.
   *
   * @method initializeLayerLoading_
   * @private
   * @param {aeris.maps.layers.AerisTile} layer
   */
  TileAnimation.prototype.initializeLayerLoading_ = function(layer) {
    var triggerLayerLoad = (function() {
      // Don't mess with the current layer.
      if (this.isCurrentLayer_(layer)) {
        return;
      }

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

    triggerLayerLoad_non_blocking();
    this.listenTo(this.masterLayer_, 'map:set', triggerLayerLoad_non_blocking);
  };


  /**
   * @private
   * @method updateTimeBounds_
   */
  TileAnimation.prototype.updateTimeBounds_ = function() {
    if (!this.times_.length) {
      return;
    }

    // Our tile loader already constrained our tile times
    // for us, so we can reset our bounds.
    this.from_ = Math.min.apply(null, this.times_);
    this.to_ = Math.max.apply(null, this.times_);
    this.limit_ = this.times_.length;
  };


  TileAnimation.prototype.getOrderedTimesFromLayers_ = function(timeLayers) {
    var times = _.map(_.keys(timeLayers), function(time) {
      return parseInt(time);
    });
    return _.sortBy(times, _.identity);
  };


  TileAnimation.prototype.getLayerForTime_ = function(time) {
    return this.timeLayers_[this.getClosestTime_(time)];
  };


  /**
   * Returns the closes available time.
   *
   * @param {number} targetTime UNIX timestamp.
   * @return {number}
   * @private
   * @method getClosestTime_
   */
  TileAnimation.prototype.getClosestTime_ = function(targetTime) {
    var closest = this.times_[0];
    var diff = Math.abs(targetTime - closest);

    _.each(this.times_, function(time) {
      var newDiff = Math.abs(targetTime - time);
      if (newDiff < diff) {
        diff = newDiff;
        closest = time;
      }
    }, this);

    return closest;
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
    this.syncLayerToMaster_(newLayer);

    // Sometime we have trouble with old layers sticking around.
    // especially when we need to reload layers for new bounds.
    // This a fail-proof way to handle that issue.
    _.each(this.timeLayers_, function(layer) {
      if (layer !== newLayer) {
        // Note that removing the old layer from the map
        // every time causes performance issues.
        layer.setOpacity(0);
        layer.stopListening(this.masterLayer_);
      }
    }, this);
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
    layer.bindAttributesTo(this.masterLayer_, boundAttrs);
  };


  TileAnimation.prototype.getCurrentLayer = function() {
    return this.getLayerForTime_(this.currentTime_);
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
