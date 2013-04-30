define(['aeris', 'base/animation'], function(aeris) {

  /**
   * @fileoverview Animation implementation for an Aeris Interactive Tile
   *               within Google Maps.
   */


  aeris.provide('aeris.maps.gmaps.animations.AerisInteractiveTile');


  /**
   * Create an animation object for an Aeris Interactive Tile within
   * Google Maps
   *
   * @constructor
   * @extends {aeris.maps.Animation}
   */
  aeris.maps.gmaps.animations.AerisInteractiveTile =
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
  aeris.inherits(aeris.maps.gmaps.animations.AerisInteractiveTile,
                 aeris.maps.Animation);


  /**
   * Initialize the times.
   *
   * @return {undefined}
   */
  aeris.maps.gmaps.animations.AerisInteractiveTile.prototype.initialize_ =
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
  aeris.maps.gmaps.animations.AerisInteractiveTile.prototype.start =
     function() {
    if (!this.layers_['CURRENT']) {
      this.layers_['CURRENT'] = this.strategy_.getData('gmap');
      var length = this.times_.length;
      for (var i = 0; i < length; i++) {
        var time = this.times_[i];
        if (time == 'CURRENT')
          continue;
        var mapTypeOptions = this.strategy_.createMapTypeOptions(time);
        var layer = new google.maps.ImageMapType(mapTypeOptions);
        this.layers_[time] = layer;
        this.strategy_.map.overlayMapTypes.push(layer);
        this.strategy_.setData('index_' + time, this.strategy_.uncontrolledIndex++);
      }
    }
    if (!this.interval_)
      this.animateInterval_(this.times_);
  };


  /**
   * @override
   */
  aeris.maps.gmaps.animations.AerisInteractiveTile.prototype.pause =
      function() {
    window.clearInterval(this.interval_);
    this.interval_ = null;
  };


  /**
   * @override
   */
  aeris.maps.gmaps.animations.AerisInteractiveTile.prototype.stop =
      function() {
    window.clearInterval(this.interval_);
    this.interval_ = null;
    var currTime = this.times_[(this.nextLayer_ - 1 < 0) ?
                              this.times_.length - 1 :
                              this.nextLayer_ - 1];
    this.strategy_.hideLayer(currTime);
    this.strategy_.setData('gmap', this.layers_['CURRENT']);
    this.strategy_.showLayer();
    this.nextLayer_ = 0;
  };


  /**
   * Create animation interval for looping over an array of specified times.
   *
   * @param {Array.<string>} times An array of time to animate over.
   * @return {undefined}
   * @private
   */
  aeris.maps.gmaps.animations.AerisInteractiveTile.prototype.
      animateInterval_ = function(times) {
    var that = this;
    this.interval_ = window.setInterval(function() {
      var layer = that.strategy_.getData('gmap');
      var currTime = times[(that.nextLayer_ - 1 < 0) ?
                                times.length - 1 :
                                that.nextLayer_ - 1];
      var nextTime = times[that.nextLayer_];
      that.strategy_.hideLayer(currTime);
      that.strategy_.setData('gmap', that.layers_[nextTime]);
      that.strategy_.showLayer(nextTime);
      that.nextLayer_ = (that.nextLayer_ + 1) % times.length;
    }, 300);
  };


  return aeris.maps.gmaps.animations.AerisInteractiveTile;

});

