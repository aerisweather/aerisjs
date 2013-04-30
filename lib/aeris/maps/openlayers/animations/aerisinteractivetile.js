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
      function(strategy) {


    aeris.maps.Animation.call(this, strategy);


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
    var time = this.strategy_.getTime();
    time.done(function(times) {
      for (var i = 9; i > 0; i--) {
        that.times_.push(times.files[i].time);
      }
      that.times_.push('CURRENT');
    });
  };


  /**
   * @override
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile.prototype.start =
     function() {
    if (!this.layers_['CURRENT']) {
      this.layers_['CURRENT'] = this.strategy_.getData('olmap');
      var length = this.times_.length;
      for (var i = 0; i < length; i++) {
        var time = this.times_[i];
        if (time == 'CURRENT')
          continue;
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
    this.strategy_.setData('olmap', this.layers_['CURRENT']);
    this.strategy_.showLayer();
  };


  /**
   * Create animation interval for looping over an array of specified times.
   *
   * @param {Array.<string>} times An array of time to animate over.
   * @return {undefined}
   * @private
   */
  aeris.maps.openlayers.animations.AerisInteractiveTile.prototype.
      animateInterval_ = function(times) {
    var that = this;
    this.interval_ = window.setInterval(function() {
      var layer = that.strategy_.getData('olmap');
      var time = times[that.nextLayer_];
      that.strategy_.hideLayer();
      that.strategy_.setData('olmap', that.layers_[time]);
      that.strategy_.showLayer();
      that.nextLayer_ = (that.nextLayer_ + 1) % times.length;
    }, 300);
  };

});
