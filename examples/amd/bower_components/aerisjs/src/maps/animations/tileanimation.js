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
   * @param {aeris.maps.layers.AerisTile} layer Base layer.
   * @param {aeris.maps.animations.options.AnimationOptions} opt_options
   * @param {number} opt_options.timestep Time between animation frames, in milliseconds.
   * @param {aeris.maps.animations.helpers.AnimationLayerLoader=} opt_options.animationLayerLoader
   */
  var TileAnimation = function(layer, opt_options) {
    var options = _.defaults(opt_options || {}, {
      // Defaults will be set after times are loaded.
      from: 0,
      to: new Date().getTime(),
      limit: null
    });

    AbstractAnimation.call(this, options);


    /**
     * The layer which is being animated
     *
     * @type {aeris.maps.layers.AerisTile}
     * @private
     * @property baseLayer_
     */
    this.baseLayer_ = layer;


    /**
     * A hash of {aeris.maps.layers.AerisTile},
     * listed by timestamp.
     *
     * @type {Object}
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


    this.animationLayerLoader_ = options.animationLayerLoader || new AnimationLayerLoader(this.baseLayer_, {
      from: this.from_,
      to: this.to_,
      limit: this.limit_
    });

    this.loadAnimationLayers();
  };
  _.inherits(TileAnimation, AbstractAnimation);


  /**
   * Load the tile layers for the animation.
   *
   * Note that is is not necessary to wait for all layers
   * to load before starting animations.
   *
   * @return {aeris.Promise} Promise to load all layers.
   * @method loadAnimationLayers
   */
  TileAnimation.prototype.loadAnimationLayers = function() {
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
      this.trigger('load:times', times, timeLayers);
    }, this);

    return this.animationLayerLoader_.load();
  };


  /**
   * Animates to the layer at the next available time,
   * or loops back to the start.
   * @method next
   */
  TileAnimation.prototype.next = function() {
    var nextTime = this.getNextTime_();

    if (!nextTime) { return; }

    this.goToTime(nextTime);
  };


  /**
   * Animates to the previous layer,
   * or loops back to the last layer.
   * @method previous
   */
  TileAnimation.prototype.previous = function() {
    var prevTime = this.getPreviousTime_();

    if (!prevTime) { return; }

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
    if (nextLayer && nextLayer.isLoaded()) {
      this.transition_(this.getCurrentLayer(), nextLayer);
    }

    // Set the new layer
    this.currentTime_ = time;

    this.trigger('change:time', new Date(this.currentTime_));
  };


  TileAnimation.prototype.getCurrentTime = function() {
    return this.currentTime_;
  };


  /**
   * @return {number} Percentage complete loading tile (1.0 is 100% complete).
   * @method getLoadProgress
   */
  TileAnimation.prototype.getLoadProgress = function() {
    return this.animationLayerLoader_.getLoadProgress();
  };


  /**
   * Removes the animated layers from the map.
   * @method remove
   */
  TileAnimation.prototype.remove = function() {
    this.stop();

    _.invoke(this.timeLayers_, 'setOpacity', 0);
  };


  /**
   * Sets the opacity of the animated
   * layers.
   *
   * @param {number} opacity
   * @method setOpacity
   */
  TileAnimation.prototype.setOpacity = function(opacity) {
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
   * @method getTimes
   */
  TileAnimation.prototype.getTimes = function() {
    return _.clone(this.times_);
  };


  TileAnimation.prototype.bindLoadEvents_ = function() {
    // Proxy load events from AnimationLayerLoader
    var proxyLayerLoaderEvents = _.partial(this.proxyEvent_, this.animationLayerLoader_);

    _.each([
      'load:progress',
      'load:complete',
      'load:error',
      'load:reset'
    ], proxyLayerLoaderEvents, this);
  };


  TileAnimation.prototype.setTimeLayers_ = function(timeLayers) {
    this.timeLayers_ = timeLayers;
    this.times_ = this.getOrderedTimesFromLayers_(timeLayers);
  };


  /**
   * @private
   * @method updateTimeBounds_
   */
  TileAnimation.prototype.updateTimeBounds_ = function() {
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


  TileAnimation.prototype.proxyEvent_ = function(target, eventName) {
    this.listenTo(target, eventName, function(var_args) {
      var args = _.argsToArray(arguments);
      this.trigger.apply(this, [eventName].concat(args));
    });
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
    this.hideAllLayersExcept_(newLayer);

    newLayer.setOpacity(this.opacity_);
  };


  TileAnimation.prototype.hideAllLayersExcept_ = function(exceptLayer) {
    _.each(this.timeLayers_, function(layer) {
      if (layer.cid !== exceptLayer.cid) {
        layer.stop().hide();
      }
    }, this);
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
