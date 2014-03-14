define([
  'aeris/util'
], function(_) {
  /**
   * Helper class for creating a collection of layers
   * from an array of timestamps
   *
   * @class TimeLayersFactory
   * @namespace aeris.maps.animations.helpers
   *
   * @constructor
   * @override
   *
   * @param {aeris.maps.layers.AerisTile} baseLayer
   * @param {Array.<number>} times Timestamps.
   *
   * @param {aeris.maps.animations.options.AnimationOptions=} opt_options
   */
  var TimeLayersFactory = function(baseLayer, times, opt_options) {
    var options = _.defaults(opt_options || {}, {
      from: null,
      to: null,
      limit: null
    });


    /**
     * @type {?Date}
     * @private
     * @property from_
     */
    this.from_ = options.from;


    /**
     * @type {?Date}
     * @private
     * @property to_
     */
    this.to_ = options.to;


    /**
     * @type {number}
     * @private
     * @property limit_
     */
    this.limit_ = options.limit;


    /**
     * @type {aeris.maps.layers.AerisTile}
     * @private
     * @property baseLayer_
     */
    this.baseLayer_ = baseLayer;


    /**
     * @type {boolean}
     * @private
     * @property isSorted_
     */
    this.isSorted_ = false;


    /**
     * @type {Array.<number>}
     * @private
     * @property times_
     */
    this.times_;
    this.setTimes(times);
  };


  /**
   * @param {Array.<number>} times
   * @method setTimes
   */
  TimeLayersFactory.prototype.setTimes = function(times) {
    this.times_ = _.clone(times);
  };


  /**
   * @return {Array.<number>} Timestamps in chronological order.
   * @method getOrderedTimes
   */
  TimeLayersFactory.prototype.getOrderedTimes = function() {
    return _.sortBy(this.times_, _.identity);
  };


  /**
   * @return {Object.<number,aeris.maps.layer.AerisTile>} A hash of timestamps to layers.
   * @method createTimeLayers
   */
  TimeLayersFactory.prototype.createTimeLayers = function() {
    var timeLayers = {};
    this.prepareTimes_();

    // We want random times for layer creation
    // So our layers are not loaded in sequential
    // chronological order (faster perceived load time).
    this.shuffleTimes_();

    _.each(this.times_, function(time) {
      var layer = this.createLayerForTime_(time);

      timeLayers[time] = layer;
    }, this);

    return timeLayers;
  };


  /**
   * @private
   * @method prepareTimes_
   */
  TimeLayersFactory.prototype.prepareTimes_ = function() {
    this.ensureTimeBoundsOptions_();
    this.constrainTimes_(this.from_, this.to_, true);

    if (this.limit_) {
      this.thinTimes_(this.limit_);
    }
  };


  /**
   * @param {number} time
   * @return {aeris.maps.layers.AerisTile}
   * @private
   * @method createLayerForTime_
   */
  TimeLayersFactory.prototype.createLayerForTime_ = function(time) {
    return this.baseLayer_.clone({
      time: new Date(time)
    });
  };


  /**
   * @private
   * @method ensureTimeBoundsOptions_
   */
  TimeLayersFactory.prototype.ensureTimeBoundsOptions_ = function() {
    this.from_ || (this.from_ = Math.min.apply(null, this.times_));
    this.to_ || (this.to_ = Math.max.apply(null, this.times_));
  };


  /**
   * @param {number} minTime
   * @param {number} maxTime
   * @private
   * @method constrainTimes_
   */
  TimeLayersFactory.prototype.constrainTimes_ = function(minTime, maxTime) {
    this.times_ = _.reject(this.times_, function(time) {
      return time < minTime || time > maxTime;
    }, this);
  };


  /**
   * @param {number} limit
   * @private
   * @method thinTimes_
   */
  TimeLayersFactory.prototype.thinTimes_ = function(limit) {
    var overageRate;
    var overage = this.times_.length - limit;

    // We are already within the limit
    if (overage <= 0) { return; }

    overageRate = this.times_.length / Math.floor(this.times_.length - this.limit_);

    // Removes times at index-intervals
    // so we keep the full time range,
    // but thinned out some.
    this.sortTimes_();

    for (var i = this.times_.length - 1; i >= 0; i -= overageRate) {
      if (this.limit_ < this.times_.length) {
        this.times_.splice(i, 1);
      }
    }
  };


  /**
   * @private
   * @method shuffleTimes_
   */
  TimeLayersFactory.prototype.shuffleTimes_ = function() {
    this.times_ = _.sample(this.times_, this.times_.length);

    this.isSorted_ = false;
  };


  /**
   * @private
   * @method sortTimes_
   */
  TimeLayersFactory.prototype.sortTimes_ = function() {
    if (this.isSorted_) { return; }

    this.times_ = _.sortBy(this.times_, function(time) {
      return time;
    });
    this.isSorted_ = true;
  };


  return TimeLayersFactory;
});
