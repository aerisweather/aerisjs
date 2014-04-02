define([
  'aeris/util'
], function(_) {
  /**
   * Simulates times returned by
   * aeris.AerisAPI#getTileTimes
   *
   * @class CannedTimes
   *
   * @param {Object} opt_options
   * @param {number} opt_options.interval Milliseconds between times.
   * @param {number} opt_options.count Number of times to return.
   * @param {number} opt_options.baseTime Timestamp of the first time.
   */
  var CannedTimes = function(opt_options) {
    var options = _.extend({
      interval: 1,
      count: 100,
      baseTime: 100
    }, opt_options);
    var times = [];

    _.times(options.count, function(i) {
      var t = options.baseTime + (options.interval * i);
      times.push(t);
    });

    return times;
  };


  return CannedTimes;
});
