define([
  'aeris', 'base/animation', 'aeris/aerisapi', 'aeris/promise'
], function(aeris) {

  /**
   * @fileoverview Animation implementation for an Aeris Interactive Tile.
   */


  aeris.provide('aeris.maps.animations.AerisInteractiveTile');


  /**
   * Create an animation object for an Aeris Interactive Tile.
   *
   * @constructor
   * @extends {aeris.maps.Animation}
   */
  aeris.maps.animations.AerisInteractiveTile = function(layer) {


    aeris.maps.Animation.call(this, layer);


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
    this.currentLayer_ = 0;


    this.initialize_();

  };
  aeris.inherits(aeris.maps.animations.AerisInteractiveTile,
                 aeris.maps.Animation);


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
    var removeTime = this.times_[this.max - 1];
    this.times_.unshift(time);
    if (this.layers_[this.times_[0]]) {
      this.layers_[removeTime].remove();
      this.layers_[removeTime] = null;
      var layer = this.layer_.clone({
        time: time
      });
      layer.hide();
      this.layers_[time] = layer;
    }
    if (this.currentLayer_ != this.max - 1)
      this.currentLayer_++;
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.start = function() {
    var self = this;
    aeris.Promise.when(this.getTimes(), this.layer_.initialized).done(
        function() {
      if (!self.started()) {
        for (var i = 0; i < self.max; i++) {
          var time = self.times_[i];
          self.ensureLayer_(time);
        }
      }
      if (!self.interval_) {
        self.animateInterval_();
        self.trigger('start');
      }
    });
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.pause =
      function() {
    window.clearInterval(this.interval_);
    this.interval_ = null;
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.stop =
      function() {
    window.clearInterval(this.interval_);
    this.interval_ = null;
    this.getCurrentLayer().hide();
    this.currentLayer_ = 0;
    this.layer_.show();
    this.trigger('stop');
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.previous =
      function() {
    this.layer_.hide();
    this.getCurrentLayer().hide();
    this.previousLayer();
    this.getCurrentLayer().show();
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.next =
      function() {
    this.layer_.hide();
    this.getCurrentLayer().hide();
    this.nextLayer();
    var curr = this.getCurrentLayer();
    curr.show();
    this.trigger('change:time', curr.time);
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.goToTime =
      function(time) {
    this.layer_.hide();
    this.getCurrentLayer().hide();

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

    this.getCurrentLayer().show();
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
    var next = this.currentLayer_ - 1;
    if (next < 0)
      next = this.max - 1;
    this.currentLayer_ = next;
  };


  /**
   * Decrement the next layer.
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.
      previousLayer = function() {
    var next = this.currentLayer_ + 1;
    if (next >= this.max)
      next = 0;
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
        time: time
      });
      layer.hide();
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


  return aeris.maps.animations.AerisInteractiveTile;

});

