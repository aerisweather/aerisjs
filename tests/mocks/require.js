define([
  'aeris/util'
], function(_) {
  var require_orig = window.require;

  /**
   * @class aeris.mocks.MockRequire
   *
   * @param {Object=} opt_options
   * @param {Boolean=} opt_options.success Default true.
   * @param {Object=} opt_options.objects Loaded modules to mock-inject.
   * @param {Object=} opt_options.error Error object.
   * @param {number=} opt_options.delay Milliseconds before calling require callbacks.
   *
   * @constructor
   */
  var MockRequire = function(opt_options) {
    var stub = jasmine.createSpy('require');

    var options = _.extend({
      // Whether to mimic a successful require call
      success: true,

      // Objects to inject
      objects: [{ foo: 'bar' }],

      // Error object
      error: {
        requireType: 'timeout',
        requireModules: ['modA', 'modB']
      },

      delay: 100
    }, opt_options);

    stub.andCallFake(function(reqs, onload, onfail) {
      var stubMethod = function() {
        if (options.success) {
          onload.apply(null, options.objects);
        }
        else {
          onfail(options.error);
        }
      };

      if (options.delay) {
        return _.delay(stubMethod, options.delay);
      }
      else {
        return stubMethod();
      }
    });

    stub.config = jasmine.createSpy('require#config');

    return stub;
  };

  beforeEach(function() {
    this.addMatchers({
      /**
       * Check that mock require object
       * was called with a set of requirements.
       * @param {Array.<string>} reqs
       * @param {Object=} opt_options
       * @param {Boolean=} opt_options.mostRecent
       *        If true, will only check the most recent call.
       * @return {boolean}
       */
      toHaveBeenCalledWithReqs: function(reqs, opt_options) {
        var reqSpy = this.actual;
        var actualReqs = [];
        var isPassing = false;
        var options = _.extend({
          mostRecent: false
        }, opt_options);
        var argsForCall = options.mostRecent ? [reqSpy.mostRecentCall.args] : reqSpy.argsForCall;

        _.each(argsForCall, function(args) {
          actualReqs.push(args[0]);
          if ((_.intersection(args[0], reqs)).length === reqs.length) {
            isPassing = true;
          }
        });

        this.message = _.bind(function() {
          var modifier = this.isNot ? 'not' : '';
          return 'Expected require to ' + modifier +
            ' have been called with ' + jasmine.pp(reqs) +
            ' Actual calls: ' + jasmine.pp(actualReqs);
        }, this);

        return isPassing;
      }
    });
  });

  afterEach(function() {
    // Restore require
    window.require = require_orig;
  });

  return MockRequire;
});
