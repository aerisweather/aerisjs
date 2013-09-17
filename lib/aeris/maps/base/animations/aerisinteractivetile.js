define([
  'aeris/util', 'base/layeranimation', 'aeris/aerisapi', 'aeris/promise'
], function(_) {

  /**
   * @fileoverview Animation implementation for an Aeris Interactive Tile.
   */


  _.provide('aeris.maps.animations.AerisInteractiveTile');


  /**
   * Create an animation object for an Aeris Interactive Tile.
   *
   * @constructor
   * @class aeris.maps.animations.AerisInteractiveTile
   * @extends {aeris.maps.Animation}
   */
  aeris.maps.animations.AerisInteractiveTile = function(layer) {


    aeris.maps.LayerAnimation.call(this, layer);


    /**
     * An array of times to animate over.
     *
     * @type {Array.<string>}
     * @private
     */
    this.times_ = [];


    /**
     * The current pointer to the javascript interval.
     *
     * @type {number}
     * @private
     */
    this.interval_ = null;


    /**
     * A hash of times/layers.
     *
     * @type {Object.<string,Object.}
     * @private
     */
    this.layers_ = {};


    /**
     * The position of the current timed layer to display.
     *
     * @type {number}
     * @private
     */
    this.currentLayer_ = layer.timeIndex;


    /**
     * Representation if the animation is in the process of rendering an
     * animation layer.
     *
     * @type {boolean}
     * @private
     */
    this.animating_ = false;


    /**
     * The visibility of the animation layers when animating.
     *
     * @type {boolean}
     */
    this.visible = this.layer_.visible;


    this.initialize_();

  };
  _.inherits(aeris.maps.animations.AerisInteractiveTile,
                 aeris.maps.LayerAnimation);


  /**
   * Initialize the times.
   *
   * @return {undefined}
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.initialize_ =
      function() {
    var that = this;
    this.getTimes().done(function(times) {
      that.times_ = times;
    });
    this.layer_.on('autoUpdate', this.autoUpdate, this);
  };


  /**
   * Notify the animation that an update of the times has occurred and process
   * the new times to begin animation of the new layer.
   *
   * @param {string} time The latest time.
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.autoUpdate =
      function(time) {
    var removeTime = this.times_[this.lowerBound()];
    this.times_.unshift(time);
    if (!this.map_) return false;
    if (this.layers_[this.times_[this.lowerBound()]]) {
      this.layers_[removeTime].remove();
      this.layers_[removeTime] = null;
      var layer = this.layer_.clone({
        time: time
      });
      layer.hide(false);
      this.layers_[time] = layer;
    }
    if (this.animating_ && this.currentLayer_ != this.lowerBound())
      this.currentLayer_++;
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.start = function() {
    if (!this.map_) return false;
    var self = this;
    aeris.Promise.when(this.getTimes(), this.layer_.initialized).done(
        function() {
      if (!self.started()) {
        for (var i = self.upperBound(); i <= self.lowerBound(); i++) {
          var time = self.times_[i];
          self.ensureLayer_(time);
        }
      }
      if (!self.interval_) {
        self.animateInterval_();
        self.trigger('start');
      }
      self.animating_ = true;
    });
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.pause =
      function() {
    if (!this.map_) return false;
    window.clearInterval(this.interval_);
    this.interval_ = null;
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.stop =
      function() {
    if (!this.map_) return false;
    window.clearInterval(this.interval_);
    this.interval_ = null;
    this.getCurrentLayer().hide(false);
    this.currentLayer_ = this.upperBound();
    if (this.visible)
      this.layer_.show(false);
    this.trigger('stop');
    this.animating_ = false;
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.previous =
      function() {
    if (!this.map_) return false;
    this.layer_.hide(false);
    this.getCurrentLayer().hide(false);
    this.previousLayer();
    var curr = this.getCurrentLayer();
    if (this.visible)
      curr.show(false);
    this.trigger('change:time', curr.time);
    this.animating_ = true;
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.next =
      function() {
    if (!this.map_) return false;
    this.layer_.hide(false);
    this.getCurrentLayer().hide(false);
    this.nextLayer();
    var curr = this.getCurrentLayer();
    if (this.visible)
      curr.show(false);
    this.trigger('change:time', curr.time);
    this.animating_ = true;
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.goToTime =
      function(time) {
    if (!this.map_) return false;
    this.layer_.hide(false);
    this.getCurrentLayer().hide(false);

    var length = this.times_.length;
    var nextLayer = length - 1;
    for (var i = nextLayer; i >= 0; i--) {
      var t = this.times_[i];
      if (parseInt(t) < time)
        nextLayer = i;
      else
        break;
    }
    this.currentLayer_ = nextLayer;

    if (this.visible)
      this.getCurrentLayer().show(false);
  };


  /**
   * Create animation interval for looping over an array of specified times.
   *
   * @return {undefined}
   * @private
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.
      animateInterval_ = function() {
    var that = this;
    this.interval_ = window.setInterval(function() {
      that.next();
    }, 300);
  };


  /**
   * Determine if the animation has started.
   *
   * @return {boolean}
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.
      started = function() {
    return this.layers_[this.times_[0]];
  };


  /**
   * Increment the next layer.
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.nextLayer =
      function() {
    var next = this.currentLayer_ - this.layer_.animationStep;
    if (next < this.upperBound())
      next = this.lowerBound();
    else if (next > this.lowerBound())
      next = this.upperBound();
    this.currentLayer_ = next;
  };


  /**
   * Decrement the next layer.
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.
      previousLayer = function() {
    var next = this.currentLayer_ + this.layer_.animationStep;
    if (next > this.lowerBound())
      next = this.upperBound();
    else if (next < this.upperBound())
      next = this.lowerBound();
    this.currentLayer_ = next;
  };


  /**
   * Get the current layer.
   *
   * @return {Object}
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.
      getCurrentLayer = function() {
    var time = this.times_[this.currentLayer_];
    this.ensureLayer_(time);
    var layer = this.layers_[time];
    return layer;
  };


  /**
   * Ensure a layer is loaded for a given time.
   *
   * @param {string} time The time to make sure is loaded.
   * @private
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.ensureLayer_ =
      function(time) {
    var layer = this.layers_[time];
    if (!layer) {
      layer = this.layer_.clone({
        map: this.map_,
        time: time
      });
      layer.hide(false);
      this.layers_[time] = layer;
    }
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.setOpacity =
      function(opacity) {
    this.forEach(function(layer) {
      layer.setOpacity(opacity);
    });
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.setVisibility =
      function(visible) {
    if (this.animating_) {
      this.layer_.hide(false);
      if (visible)
        this.getCurrentLayer().show(false);
      else
        this.getCurrentLayer().hide(false);
    }
    this.visible = visible;
  };


  /**
   * Loop through all layers and call the callback function with the
   * animation's context and the layer as the argument.
   *
   * @param {Function} fn The callback function.
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.forEach = function(fn) {
    var time;
    for (time in this.layers_) {
      var layer = this.layers_[time];
      fn.call(this, layer);
    }
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.getTimes = function() {
    return aeris.AerisAPI.getTileTimes(this.layer_);
  };


  /**
   * Get the upper bound limit of the times index.
   *
   * @return {number}
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.upperBound =
      function() {
    return this.layer_.timeIndex;
  };


  /**
   * Get the lower bound limit of the times index.
   *
   * @return {number}
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.lowerBound =
      function() {
    return this.layer_.timeIndex +
           Math.abs(this.max * this.layer_.animationStep) - 1;
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.remove = function() {
    aeris.maps.LayerAnimation.prototype.remove.call(this);
    window.clearInterval(this.interval_);
    this.interval_ = null;
    if (this.animating_)
      this.getCurrentLayer().hide(false);
    this.currentLayer_ = this.upperBound();
    this.trigger('stop');
    this.animating_ = false;
    this.forEach(function(layer) {
      layer.remove();
    });
    this.layers_ = {};
  };


  return aeris.maps.animations.AerisInteractiveTile;

});

