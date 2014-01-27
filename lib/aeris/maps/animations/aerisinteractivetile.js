define([
  'ai/util',
  'ai/maps/animations/abstractanimation',
  'ai/maps/animations/helpers/animationlayerloader'
], function(_, AbstractAnimation, AnimationLayerLoader) {
  /**
   * Animates a single {aeris.maps.layers.AerisInteractiveTile} layer.
   *
   * @class aeris.maps.animations.AerisInteractiveTile
   * @constructor
   * @extends aeris.maps.animations.AbstractAnimation
   *
   * @param {aeris.maps.layers.AerisInteractiveTile} layer Base layer.
   * @param {aeris.maps.animations.options.AnimationOptions} opt_options
   * @param {number} opt_options.timestep Time between animation frames, in milliseconds.
   * @param {aeris.maps.animations.helpers.AnimationLayerLoader=} opt_options.animationLayerLoader
   */
  var AerisInteractiveTileAnimation = function(layer, opt_options) {
    var options = _.defaults(opt_options || {}, {
      // Defaults will be set after times are loaded.
      from: null,
      to: null,
      limit: null
    });

    AbstractAnimation.call(this, options);


    /**
     * The layer which is being animated
     *
     * @type {aeris.maps.layers.AerisInteractiveTile}
     * @private
     */
    this.baseLayer_ = layer;


    /**
     * A hash of {aeris.maps.layers.AerisInteractiveTile},
     * listed by timestamp.
     *
     * @type {Object}
     * @private
     */
    this.timeLayers_ = {};


    /**
     * An array of available timestamps.
     *
     * @type {Array.number}
     * @private
     */
    this.times_ = [];


    this.animationLayerLoader_ = options.animationLayerLoader || new AnimationLayerLoader(this.baseLayer_, {
      from: this.from_,
      to: this.to_,
      limit: this.limit_
    });
  };
  _.inherits(AerisInteractiveTileAnimation, AbstractAnimation);


  /**
   * Load the tile layers for the animation.
   *
   * Note that is is not necessary to wait for all layers
   * to load before starting animations.
   *
   * @return {aeris.Promise} Promise to load all layers
   */
  AerisInteractiveTileAnimation.prototype.loadAnimationLayers = function() {
    this.baseLayer_.set({
      // Turn autoUpdate off, to prevent
      // some funky behavior.
      autoUpdate: false,

      // All cloned layers should be hidden
      opacity: 0
    });

    this.bindLoadEvents_();

    this.animationLayerLoader_.once('load:times', function(times, timeLayers) {
      this.setTimeLayers_(timeLayers);
      this.updateTimeBounds_();
      this.goToTime(this.to_);
    }, this);

    return this.animationLayerLoader_.load();
  };


  /**
   * Animates to the layer at the next available time,
   * or loops back to the start.
   */
  AerisInteractiveTileAnimation.prototype.next = function() {
    var nextTime = this.getNextTime_();

    this.goToTime(nextTime);
  };


  /**
   * Animates to the previous layer,
   * or loops back to the last layer.
   */
  AerisInteractiveTileAnimation.prototype.previous = function() {
    var prevTime = this.getPreviousTime_();

    this.goToTime(prevTime);
  };


  /**
   * Animates to the layer at the specified time.
   *
   * If no layer exists at the exact time specified,
   * will use the closest available time.
   *
   * @param {number|Date} time UNIX timestamp or date object.
   */
  AerisInteractiveTileAnimation.prototype.goToTime = function(time) {
    var nextLayer;

    time = _.isDate(time) ? time.getTime() : time;

    nextLayer = this.getLayerForTime_(time);

    // Only transition if the layer is loaded
    // to prevent gaps in animation.
    if (nextLayer && nextLayer.isLoaded()) {
      this.transition_(this.getCurrentLayer(), nextLayer);
    }

    // Set the new layer
    this.currentTime_ = time;

    this.trigger('change:time', new Date(this.currentTime_));
  };


  AerisInteractiveTileAnimation.prototype.getCurrentTime = function() {
    return this.currentTime_;
  };


  /** @return {number} Percentage complete loading tile (1.0 is 100% complete). */
  AerisInteractiveTileAnimation.prototype.getLoadProgress = function() {
    return this.animationLayerLoader_.getLoadProgress();
  };


  /**
   * Destroys the animation object.
   * Stop animating, and remove all animated layers.
   */
  AerisInteractiveTileAnimation.prototype.remove = function() {
    this.stop();
    this.stopListening();

    // Remove all the layers from the map
    _.each(this.timeLayers_, function(layer) {
      layer.setMap(null);
    }, this);

    this.times_.length = 0;
  };


  /**
   * Sets the opacity of the animated
   * layers.
   *
   * @param {number} opacity
   */
  AerisInteractiveTileAnimation.prototype.setOpacity = function(opacity) {
    var currentLayer = this.getCurrentLayer();

    this.opacity_ = opacity;

    if (currentLayer) {
      currentLayer.setOpacity(this.opacity_);
    }
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
   */
  AerisInteractiveTileAnimation.prototype.getTimes = function() {
    return _.clone(this.times_);
  };


  AerisInteractiveTileAnimation.prototype.bindLoadEvents_ = function() {
    // Proxy load events from AnimationLayerLoader
    var proxyLayerLoaderEvents = _.partial(this.proxyEvent_, this.animationLayerLoader_);

    _.each([
      'load:times',
      'load:progress',
      'load:complete',
      'load:error',
      'load:reset'
    ], proxyLayerLoaderEvents, this);
  };


  AerisInteractiveTileAnimation.prototype.setTimeLayers_ = function(timeLayers) {
    this.timeLayers_ = timeLayers;
    this.times_ = this.getOrderedTimesFromLayers_(timeLayers);
  };


  /** @private */
  AerisInteractiveTileAnimation.prototype.updateTimeBounds_ = function() {
    // Our tile loader already constrained our tile times
    // for us, so we can reset our bounds.
    this.from_ = Math.min.apply(null, this.times_);
    this.to_ = Math.max.apply(null, this.times_);
    this.limit_ = this.times_.length;
  };


  AerisInteractiveTileAnimation.prototype.getOrderedTimesFromLayers_ = function(timeLayers) {
    var times = _.map(_.keys(timeLayers), function(time) {
      return parseInt(time);
    });
    return _.sortBy(times, _.identity);
  };


  AerisInteractiveTileAnimation.prototype.proxyEvent_ = function(target, eventName) {
    this.listenTo(target, eventName, function(var_args) {
      var args = _.argsToArray(arguments);
      this.trigger.apply(this, [eventName].concat(args));
    });
  };


  AerisInteractiveTileAnimation.prototype.getLayerForTime_ = function(time) {
    return this.timeLayers_[this.getClosestTime_(time)];
  };


  /**
   * Returns the closes available time.
   *
   * @param {number} targetTime UNIX timestamp.
   * @return {number}
   * @private
   */
  AerisInteractiveTileAnimation.prototype.getClosestTime_ = function(targetTime) {
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
   * @param {aeris.maps.layers.AerisInteractiveTile} oldLayer
   * @param {aeris.maps.layers.AerisInteractiveTile} newLayer
   * @private
   */
  AerisInteractiveTileAnimation.prototype.transition_ = function(oldLayer, newLayer) {
    this.hideAllLayersExcept_(newLayer);

    newLayer.setOpacity(this.opacity_);
  };


  AerisInteractiveTileAnimation.prototype.hideAllLayersExcept_ = function(exceptLayer) {
    _.each(this.timeLayers_, function(layer) {
      if (layer.cid !== exceptLayer.cid) {
        layer.stop().hide();
      }
    }, this);
  };


  AerisInteractiveTileAnimation.prototype.getCurrentLayer = function() {
    return this.getLayerForTime_(this.currentTime_);
  };


  AerisInteractiveTileAnimation.prototype.getNextTime_ = function() {
    return this.isCurrentLayerLast_() ?
      this.times_[0] : this.times_[this.getLayerIndex_() + 1];
  };


  AerisInteractiveTileAnimation.prototype.getPreviousTime_ = function() {
    var lastTime = _.last(this.times_);
    return this.isCurrentLayerFirst_() ?
      lastTime : this.times_[this.getLayerIndex_() - 1];
  };


  /**
   * @return {boolean} True, if the current layer is the first frame.
   * @private
   */
  AerisInteractiveTileAnimation.prototype.isCurrentLayerFirst_ = function() {
    return this.getLayerIndex_() === 0;
  };


  /**
   * @return {boolean} True, if the current layer is the last frame.
   * @private
   */
  AerisInteractiveTileAnimation.prototype.isCurrentLayerLast_ = function() {
    return this.getLayerIndex_() === this.times_.length - 1;
  };


  /**
   * Returns the index of the current layer
   * within this.times_.
   *
   * @return {number}
   * @private
   */
  AerisInteractiveTileAnimation.prototype.getLayerIndex_ = function() {
    var timeOfCurrentLayer = this.getClosestTime_(this.currentTime_);
    return this.times_.indexOf(timeOfCurrentLayer);
  };



  return _.expose(AerisInteractiveTileAnimation, 'aeris.maps.animations.AerisInteractiveTile');
});
