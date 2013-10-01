define([
  'aeris/util',
  'aeris/aerisapi',
  'aeris/promise',
  'base/animations/abstractanimation'
], function(_, AerisAPI, Promise, AbstractAnimation) {
  /**
   * Animates a single {aeris.maps.layers.AerisInteractiveTile} layer.
   *
   * @class aeris.maps.animations.AerisInteractiveTile
   * @constructor
   * @extends aeris.maps.animations.AnimationInterface
   *
   * @param {aeris.maps.layers.AerisInteractiveTile} layer Base layer.
   * @param {Object} opt_options
   * @param {number} opt_options.limit Max number of tile 'frames' to load.
   * @param {number} opt_options.timestep Time between animation frames, in milliseconds.
   */
  var AerisInteractiveTileAnimation = function(layer, opt_options) {
    var options = _.extend({
      from: undefined,
      to: new Date(),
      limit: 500
    }, opt_options);

    AbstractAnimation.call(this, options);


    /**
     * The layer which is being animated
     *
     * @type {aeris.maps.layers.AerisInteractiveTile}
     * @private
     */
    this.baseLayer_ = layer;


    /**
     * The current 'frame' visible on the map.
     * @type {aeris.maps.layers.AerisInteractiveTile}
     * @private
     */
    this.currentLayer_;


    /**
     * A hash of {aeris.maps.layers.AerisInteractiveTile},
     * listed by timestamp.
     *
     * @type {Object}
     * @private
     */
    this.layers_ = {};


    /**
     * An array of available timestamps.
     *
     * @type {Array.number}
     * @private
     */
    this.times_ = [];


    /**
     * Max number of animation 'frames' (layers)
     * to load.
     *
     * @type {number}
     * @private
     * @default 20
     */
    this.limit_ = options.limit;


    this.initialize_();
  };
  _.inherits(AerisInteractiveTileAnimation, AbstractAnimation);


  /**
   * Loads tile times,
   * and creates layer 'frames'.
   *
   * @private
   */
  AerisInteractiveTileAnimation.prototype.initialize_ = function() {
    // Prepare base layer
    this.baseLayer_.set('autoUpdate', false);
    this.baseLayer_.hide();
    this.currentLayer_ = this.baseLayer_;

    AerisAPI.getTileTimes(this.baseLayer_).done(function(times) {
      this.createTimeLayers_(times);

      this.trigger('load:times', times);
    }, this);
  };

  AerisInteractiveTileAnimation.prototype.delegateLayerEvents_ = function() {
    _.each(this.layers_, function(layer) {
      this.listenTo(layer, {
        'load': function() {
          var progress = this.getLoadProgress();
          this.trigger('load:progress', progress);

          if (progress >= 1) {
            this.trigger('load');
          }
        },
        'load:reset': function() {
          this.trigger('load:progress', this.getLoadProgress());
        }
      });
    }, this);
  };

  AerisInteractiveTileAnimation.prototype.undelegateLayerEvents_ = function() {
    _.each(this.layers_, function(layer) {
      this.stopListening(layer);
    }, this);
  };


  /**
   * @return {number} Percentage complete loading tile (1.0 is 100% complete).
   */
  AerisInteractiveTileAnimation.prototype.getLoadProgress = function() {
    var completeCount = 0;
    _.each(this.layers_, function(layer) {
      if (layer.isLoaded()) {
        completeCount++;
      }
    });

    return completeCount / this.times_.length || 0;
  };


  /**
   * Create clones of this.baseLayer_
   * for each tileTime.
   * Add each layer to this.layers_.
   * Adds each time to this.times_.
   *
   * @param {Array.<string>} tileTimes Collection of UNIX timestamps.
   * @private
   */
  AerisInteractiveTileAnimation.prototype.createTimeLayers_ = function(tileTimes) {
    // Sort times from oldest to newest
    tileTimes = _.sortBy(tileTimes, function(time) {
      return time;
    });

    // Set default from as the first available time.
    this.from_ || (this.from_ = new Date(tileTimes[0]));
    this.currentTime_ || (this.currentTime_ = this.from_.getTime());

    // Bound times by from/to
    tileTimes = _.filter(tileTimes, function(time) {
      return (time >= this.from_.getTime() && time <= this.to_.getTime());
    }, this);


    // Thin out tileTimes to limit
    if (this.limit_ < tileTimes.length) {
      var overageRate = tileTimes.length / Math.floor(tileTimes.length - this.limit_);


      // Removes times at index-intervals
      // so we keep the full time range,
      // but thinned out some.
      for (var i = tileTimes.length - 1; i >= 0; i -= overageRate) {
        if (this.limit_ < tileTimes.length) {
          tileTimes.splice(i, 1);
        }
      }
    }

    // We want to avoid loading tiles in order
    // of their time, so during loading, we have
    // the full time-range of the animation. During loading
    // we want the range to stay the same, which the
    // framerate increases.
    //
    // This sorting algorithm should evenly space the
    // tile times.
    tileTimes = _.sortBy(tileTimes, function(time) {
      for (var i = 100000; i > 0;) {
        if (time % i === 0) {
          return 100000 - i;
        }
        else {
          i = Math.ceil(i / 2);
        }
      }
      return i;
    });

    _.each(tileTimes, function(time) {
      var layer;

      time = parseInt(time);

      layer = this.baseLayer_.clone({
        time: new Date(time),
        autoUpdate: false
      });
      layer.hide();


      this.times_.push(time);
      this.layers_[time] = layer;
    }, this);

    this.delegateLayerEvents_();

    // Sort the times.
    this.times_ = _.sortBy(this.times_, function(time) {
      return time;
    });


    if (this.getFirstLayer_()) {
      this.currentLayer_ = this.getFirstLayer_();
      this.currentLayer_.show();
    }
  };


  /**
   * Animates to the layer at the next available time,
   * or loops back to the start.
   */
  AerisInteractiveTileAnimation.prototype.next = function() {
    var nextTime = this.isLastLayer_() ?
      this.times_[0] :
      this.times_[this.getLayerIndex_() + 1];

    this.goToTime(nextTime);
  };


  /**
   * Animates to the previous layer,
   * or loops back to the last layer.
   */
  AerisInteractiveTileAnimation.prototype.previous = function() {
    var lastTime = this.times_[this.times_.length - 1];
    var prevTime = this.isFirstLayer_() ?
      lastTime :
      this.times_[this.getLayerIndex_() - 1];

    this.goToTime(prevTime);
  };

  AerisInteractiveTileAnimation.prototype.remove = function() {
    this.stop();
    this.undelegateLayerEvents_();

    // Remove all the layers from the map
    _.each(this.layers_, function(layer) {
      layer.remove();
    }, this);
  };


  /**
   * Sets the opacity of the animated
   * layers.
   *
   * @param {number} opacity
   */
  AerisInteractiveTileAnimation.prototype.setOpacity = function(opacity) {
    this.opacity_ = opacity;

    this.currentLayer_.setOpacity(this.opacity_);
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


  /**
   * Returns the index of the current layer
   * within this.times_.
   *
   * @return {number}
   * @private
   */
  AerisInteractiveTileAnimation.prototype.getLayerIndex_ = function() {
    return this.times_.indexOf(this.currentLayer_.getTimestamp());
  };


  /**
   * Returns the first 'frame'.
   *
   * @return {aeris.maps.layers.AerisInteractiveTile}
   * @private
   */
  AerisInteractiveTileAnimation.prototype.getFirstLayer_ = function() {
    var firstTime = this.times_[0];
    return this.layers_[firstTime];
  };


  /**
   * Returns the last 'frame'.
   *
   * @return {aeris.maps.layers.AerisInteractiveTile}
   * @private
   */
  AerisInteractiveTileAnimation.prototype.getLastLayer_ = function() {
    var lastTime = _.last(this.times_);
    return this.layers_[lastTime];
  };


  /**
   * @return {boolean} True, if the current layer is the first frame.
   * @private
   */
  AerisInteractiveTileAnimation.prototype.isFirstLayer_ = function() {
    return this.getLayerIndex_() === 0;
  };

  /**
   * @return {boolean} True, if the current layer is the last frame.
   * @private
   */
  AerisInteractiveTileAnimation.prototype.isLastLayer_ = function() {
    return this.getLayerIndex_() === this.times_.length - 1;
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

    // Normalize time as timestamp
    time = _.isDate(time) ? time.getTime() : time;

    // Get the next available layer
    nextLayer = this.layers_[this.getClosestTime_(time)];

    // Only transition if the layer is loaded
    // to prevent gaps in animation.
    if (nextLayer && nextLayer.isLoaded()) {
      this.transition_(this.currentLayer_, nextLayer);
    }

    // Set the new layer
    this.currentTime_ = time;
    this.currentLayer_ = nextLayer;

    this.trigger('change:time', new Date(this.currentTime_));
  };


  /**
   * Transition from one layer to another.
   *
   * @param {aeris.maps.layers.AerisInteractiveTile} oldLayer
   * @param {aeris.maps.layers.AerisInteractiveTile} newLayer
   * @private
   */
  AerisInteractiveTileAnimation.prototype.transition_ = function(oldLayer, newLayer) {
    _.each(this.layers_, function(layer) {
      if (layer.cid !== newLayer.cid) {
        layer.stop().hide();
      }
    }, this);

    newLayer.setOpacity(this.opacity_);
  };


  /**
   * Returns the closes available time.
   *
   * @param {number} targetTime UNIX timestamp.
   * @return {number}
   * @private
   */
  AerisInteractiveTileAnimation.prototype.getClosestTime_ = function(targetTime) {
    var closest = null;

    _.each(this.times_, function(time) {
      if (closest == null || Math.abs(time - targetTime) < Math.abs(closest - targetTime)) {
        closest = time;
      }
    }, this);

    return closest;
  };



  return _.expose(AerisInteractiveTileAnimation, 'aeris.maps.animations.AerisInteractiveTile');
});
