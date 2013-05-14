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
     * The position of the next timed layer to display.
     *
     * @type {number}
     * @private
     */
    this.nextLayer_ = 0;


    /**
     * A Promise representing the loading of the times.
     *
     * @type {aeris.Promise}
     * @private
     */
    this.timesPromise_ = null;


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
    this.timesPromise = aeris.AerisAPI.getTileTimes(this.layer_);
    this.timesPromise.done(function(times) {
      for (var i = 9; i >= 0; i--) {
        that.times_.push(times[i]);
      }
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
    var removedTime = this.times_.shift();
    this.times_.push(time);
    if (this.layers_[removedTime]) {
      this.layers_[removedTime].remove();
      this.layers_[removedTime] = null;
      var layer = this.layer_.clone({
        time: time
      });
      layer.hide();
      this.layers_[time] = layer;
    }
    this.nextLayer_ = this.nextLayer_ === 0 ? 0 : this.nextLayer_ - 1;
  };


  /**
   * @override
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.start =
     function() {
    var self = this;
    aeris.Promise.when(this.timesPromise, this.layer_.initialized).done(
        function() {
      if (!self.started()) {
        var length = self.times_.length;
        for (var i = 0; i < length; i++) {
          var time = self.times_[i];
          var layer = self.layer_.clone({
            time: time
          });
          layer.hide();
          self.layers_[time] = layer;
        }
      }
      if (!self.interval_)
        self.animateInterval_();
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
    this.nextLayer_ = 0;
    this.layer_.show();
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
      that.layer_.hide();
      that.getCurrentLayer().hide()
      that.getNextLayer().show();
      that.nextLayer();
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
    this.nextLayer_ = (this.nextLayer_ + 1) % this.times_.length;
  };


  /**
   * Decrement the next layer.
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.
      previousLayer = function() {
    var next = this.nextLayer_ - 1;
    if (next < 0)
      next = this.times_.length - 1;
    this.nextLayer_ = next;
  };


  /**
   * Get the next layer.
   *
   * @return {Object}
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.
      getNextLayer = function() {
    return this.layers_[this.times_[this.nextLayer_]];
  };


  /**
   * Get the current layer.
   *
   * @return {Object}
   */
  aeris.maps.animations.AerisInteractiveTile.prototype.
      getCurrentLayer = function() {
    var prev = this.nextLayer_ - 1;
    if (prev < 0)
      prev = this.times_.length - 1;
    return this.layers_[this.times_[prev]];
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


  return aeris.maps.animations.AerisInteractiveTile;

});

