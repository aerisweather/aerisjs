define(['sinon', 'underscore'], function(sinon, _) {
  var now_orig = _.now;
  var clock;

  /**
   * Resolves sinon-underscore integration issues
   * with underscore's v1.6.0 usage of Date.now.
   *
   * @class MockClock
   * @static
   */
  return {
    useFakeTimers: function(var_args) {
      _.now = function() { return new Date().getTime(); };
      clock = sinon.useFakeTimers.apply(sinon, arguments);
    },
    restore: function() {
      clock.restore();
      _.now = now_orig;
    },
    tick: function(int) {
      if (!clock || !clock.tick) {
        throw new Error('Unable to tick: Fake timers are not in use.');
      }

      clock.tick(int);
    }
  };
});
