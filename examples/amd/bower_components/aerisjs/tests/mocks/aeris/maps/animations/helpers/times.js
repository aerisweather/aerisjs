define([
  'aeris/util'
], function(_) {
  var MockTimes = function(opt_count, opt_min, opt_max) {
    var count = opt_count || 10;
    var min = opt_min || 10;
    var max = opt_max || 100;
    var step = (max - min) / (count - 1);
    var times = _.range(min, max + 1, step);

    // Aeris API provides times in reverse order
    return times.reverse();
  };

  return MockTimes;
});
