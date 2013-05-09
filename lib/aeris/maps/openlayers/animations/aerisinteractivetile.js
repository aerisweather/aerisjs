define(['aeris', 'base/animation'], function(aeris) {

  /**
   * @fileoverview Animation implementation for an Aeris Interactive Tile
   *               within OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.animations.AerisInteractiveTile');


  /**
   * Create an animation object for an Aeris Interactive Tile within
   * OpenLayers
   *
   * @constructor
   * @extends {aeris.maps.Animation}
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile =
      function(strategy, layer, map) {


    aeris.maps.Animation.call(this, strategy, layer, map);


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


    this.initialize_();

  };
  aeris.inherits(aeris.maps.openlayers.animations.AerisInteractiveTile,
                 aeris.maps.Animation);


  /**
   * Initialize the times.
   *
   * @return {undefined}
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile.prototype.initialize_ =
      function() {
    var that = this;
    var timesPromise = this.strategy_.getTimes(this.layer_);
    timesPromise.done(function(times) {
      for (var i = 9; i >= 0; i--) {
        that.times_.push(times[i]);
      }
    });
    //this.strategy_.on('autoUpdate', this.autoUpdate, this);
  };


  /**
   * Notify the animation that an update of the times has occurred and process
   * the new times to begin animation of the new layer.
   *
   * @param {Obect} data The latest JSON data of the times.
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile.prototype.autoUpdate =
      function(data) {
    if (this.interval_) {
      var nullTime = this.times_.shift();
      this.layers_[nullTime].destroy();
      this.layers_[nullTime] = null;
      var time = data.files[0].time;
      this.times_.push(time);
      var urls = this.strategy_.createUrls(time);
      var layer = new OpenLayers.Layer.XYZ(
        this.strategy_.layer.name + '_' + time,
        urls,
        {
          isBaseLayer: false,
          sphericalMercator: true,
          wrapDataLine: true,
          transitionEffect: 'resize',
          visibility: false
        });
      this.layers_[time] = layer;
      this.strategy_.map.addLayer(layer);
      this.stop();
      this.start();
    }
  };


  /**
   * @override
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile.prototype.start =
     function() {
    if (!this.started()) {
      var length = this.times_.length;
      for (var i = 0; i < length; i++) {
        var time = this.times_[i];
        var layer = this.strategy_.createInstanceLayer(this.layer_, time, {
          visibility: false
        });
        this.layers_[time] = layer;
        this.strategy_.registerInstanceLayer(layer, this.map_.map);
      }
    }
    if (!this.interval_)
      this.animateInterval_(this.times_);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile.prototype.pause =
      function() {
    window.clearInterval(this.interval_);
    this.interval_ = null;
  };


  /**
   * @override
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile.prototype.stop =
      function() {
    window.clearInterval(this.interval_);
    this.interval_ = null;
    this.nextLayer_ = 0;
    this.strategy_.hideLayer();
    this.strategy_.setData('olmap', this.strategy_.staticLayer_);
    this.strategy_.showLayer();
  };


  /**
   * @override
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile.prototype.previous =
      function() {
    this.nextLayer_ = this.nextLayer_ - 1;
    if (this.nextLayer_ < 0)
      this.nextLayer_ = this.times_.length - 1;
    this.strategy_.hideLayer();
    var setLayer = this.nextLayer_ - 1;
    if (setLayer < 0)
      setLayer = this.times_.length - 1;
    this.strategy_.setData('olmap', this.layers_[this.times_[setLayer]]);
    this.strategy_.showLayer();
  };


  /**
   * @override
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile.prototype.next =
      function() {
    var setLayer = this.nextLayer_;
    this.nextLayer_ = (this.nextLayer_ + 1) % this.times_.length;
    this.strategy_.hideLayer();
    this.strategy_.setData('olmap', this.layers_[this.times_[setLayer]]);
    this.strategy_.showLayer();
  };


  /**
   * Create animation interval for looping over an array of specified times.
   *
   * @return {undefined}
   * @private
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile.prototype.
      animateInterval_ = function() {
    this.layer_.hide();
    var that = this;
    this.interval_ = window.setInterval(function() {
      that.strategy_.hideLayer(that.getCurrentLayer());
      that.strategy_.showLayer(that.getNextLayer());
      that.nextLayer();
    }, 300);
  };


  /**
   * Determine if the animation has started.
   *
   * @return {boolean}
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile.prototype.
      started = function() {
    return this.layers_[this.times_[0]];
  };


  /**
   * Increment the next layer.
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile.prototype.nextLayer =
      function() {
    this.nextLayer_ = (this.nextLayer_ + 1) % this.times_.length;
  };


  /**
   * Get the next layer.
   *
   * @return {Object}
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile.prototype.
      getNextLayer = function() {
    return this.layers_[this.times_[this.nextLayer_]];
  };


  /**
   * Get the current layer.
   *
   * @return {Object}
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile.prototype.
      getCurrentLayer = function() {
    var prev = this.nextLayer_ - 1;
    if (prev < 0)
      prev = this.times_.length - 1;
    return this.layers_[this.times_[prev]];
  };


  return aeris.maps.openlayers.animations.AerisInteractiveTile;

});
