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
     * A hash of layers for times.
     * @type {Object.<number,aeris.maps.layers.AerisTile>}
     * @private
     */
    this.timeLayers_ = {};


    /**
     * @type {Array.<number>}
     * @private
     * @property times_
     */
    this.times_ = [];

    if (times) {
      this.setTimes(times);
    }
  };


  /**
   * @param {Array.<number>} times
   * @method setTimes
   */
  TimeLayersFactory.prototype.setTimes = function(times) {
    var removedTimes = _.difference(this.times_, times);

    // Clean up removed times
    removedTimes.forEach(this.removeTime_, this);

    this.times_ = times;
  };


  /**
   * @method removeTime_
   * @private
   */
  TimeLayersFactory.prototype.removeTime_ = function(time) {
    this.times_ = _.without(this.times_, time);

    // Clean the layer we made for this time
    if (this.timeLayers_[time]) {
      this.timeLayers_[time].destroy();
      delete this.timeLayers_[time];
    }
  };


  /**
   * @method setFrom
   * @param {number} from Timestamp.
   */
  TimeLayersFactory.prototype.setFrom = function(from) {
    this.from_ = from;
  };


  /**
   * @method setTo
   * @param {number} to Timestamp.
   */
  TimeLayersFactory.prototype.setTo = function(to) {
    this.to_ = to;
  };


  /**
   * @method setLimit
   * @param {number} limit
   */
  TimeLayersFactory.prototype.setLimit = function(limit) {
    this.limit_ = limit;
  };


  /**
   * @return {Object.<number,aeris.maps.layer.AerisTile>} A hash of timestamps to layers.
   * @method createTimeLayers
   */
  TimeLayersFactory.prototype.createTimeLayers = function() {
    this.resetTimeLayers_();
    this.prepareTimes_();

    // Make sure we have at least one time layer.
    if (!this.times_.length) {
      this.timeLayers_[Date.now()] = this.createLayerForTime_(this.baseLayer_.get('time').getTime());
      return this.timeLayers_;
    }

    // We want random times for layer creation
    // So our layers are not loaded in sequential
    // chronological order (faster perceived load time).
    this.shuffleTimes_();

    _.each(this.times_, function(time) {
      this.timeLayers_[time] = this.createLayerForTime_(time);
    }, this);

    // Make sure times are sorted
    this.sortTimes_();

    return this.timeLayers_;
  };


  /**
   * @method resetTimeLayers_
   * @private
   */
  TimeLayersFactory.prototype.resetTimeLayers_ = function() {
    _.each(this.timeLayers_, function(layer, time) {
      this.removeTime_(time);
    }, this);
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
      time: new Date(time),
      map: null,
      autoUpdate: false
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
    this.times_.forEach(function(time) {
      var isOutOfBounds = time < minTime || time > maxTime;

      if (isOutOfBounds) {
        this.removeTime_(time);
      }
    }, this);
  };


  /**
   * @param {number} limit
   * @private
   * @method thinTimes_
   */
  TimeLayersFactory.prototype.thinTimes_ = function(limit) {
    var isTimeAlreadyAdded;
    var latestTime, earliestTime, mostCurrentTime, closestTime;
    var step, thinnedTimes;

    if (this.times_.length <= limit) {
      return;
    }

    earliestTime = Math.min.apply(Math, this.times_);
    latestTime = Math.max.apply(Math, this.times_);
    mostCurrentTime = this.getClosestTime_(Date.now());

    // Always include earliest, latest, and most-current times.
    thinnedTimes = _.uniq([earliestTime, mostCurrentTime, latestTime]);

    // Add times at regular time intervals
    // Example:
    //  - We start with [0, 200, 1024]
    //  - We add [0, 512, 1024] --> [0, 200, 512, 1024]
    //  - We add [0, 256, 512, 1024] --> [0, 200, 256, 512, 1024]
    //  etc.. until we reach our limit.

    step = (latestTime - earliestTime) / 2;
    while (thinnedTimes.length < limit && step >= 1) {
      var timesToAdd = [];
      var amountUnderLimit = limit - thinnedTimes.length;
      var time = earliestTime;

      // Grab times at every `step` interval
      while (time < latestTime) {
        time += step;

        closestTime = this.getClosestTime_(time);
        isTimeAlreadyAdded = _.contains(thinnedTimes, closestTime) || _.contains(timesToAdd, closestTime);

        if (!isTimeAlreadyAdded) {
          timesToAdd.push(closestTime);
        }
      }

      // Make sure we're not going over the limit
      if (timesToAdd.length > amountUnderLimit) {
        timesToAdd.length = amountUnderLimit;
      }

      // Add the new set of times
      thinnedTimes.push.apply(thinnedTimes, timesToAdd);

      // Use a smaller interval for the next iteration
      step = Math.floor(step / 2);
    }

    this.setTimes(thinnedTimes);
  };

  // TODO: move into util function,
  // to share with TileAnimation
  // Or, maybe all of the layer/time collection logic
  // should be moved into a helper/base-class/mixin
  // Then TileAnimation would call
  // this.myHelper_.getTileForTime(time), instead of
  // having to handle all that logic itself.
  // Or, maybe TimeLayerCollection should be it's own class,
  // and it should handle all of that logic.
  /**
   * @method getClosestTime_
   *
   * @param {number} targetTime
   * @return {number}
   * @private
   */
  TimeLayersFactory.prototype.getClosestTime_ = function(targetTime) {
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
   * @private
   * @method shuffleTimes_
   */
  TimeLayersFactory.prototype.shuffleTimes_ = function() {
    this.times_ = _.sample(this.times_, this.times_.length);
  };


  /**
   * @private
   * @method sortTimes_
   */
  TimeLayersFactory.prototype.sortTimes_ = function() {
    this.times_ = this.getOrderedTimes();
  };


  /**
   * @return {Array.<number>} Timestamps in chronological order.
   * @method getOrderedTimes
   */
  TimeLayersFactory.prototype.getOrderedTimes = function() {
    return this.times_.sort(function(a, b) {
      return a > b ? 1 : -1;
    });
  };


  /**
   * @method destroy
   */
  TimeLayersFactory.prototype.destroy = function() {
    this.times_.length = 0;
  };


  return TimeLayersFactory;
});
