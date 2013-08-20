define([
  'aeris/promise',
  'sinon',
  'aeris/util'
], function(Promise, sinon, _) {
  /**
   * A factory for creating stubbed promise instances,
   * which can immediately call the done or fail
   * callbacks.
   *
   * If no resolve or fail option is requested,
   * the stubbed 'done/fail/always' callbacks will simply
   * return the promise object for chainability.
   *
   * If either the done or fail option is requested,
   * the always callback will also be called.
   *
   * @param {Object=} opt_options
   * @param {Boolean=} opt_options.resolve Whether to call the `done` callback.
   * @param {Boolean=} opt_options.fail Whether to call the `fail` callback.
   * @param {Array} opt_options.args Arguments to pass the callbacks.
   * @return {aeris.Promise} Mock promise object.
   *
   * @constructor
   */
  var StubbedPromise = function(opt_options) {
    var promise = sinon.createStubInstance(Promise);

    var options = _.extend({
      resolve: false,
      fail: false,
      args: []
    }, opt_options);

    spyOn(promise, 'done').andCallFake(function(callback, ctx) {
      if (options.resolve) {
        callback.apply(ctx, options.args);
      }
      return promise;
    });
    spyOn(promise, 'fail').andReturn(function(callback, ctx) {
      if (options.fail) {
        callback.apply(ctx, options.args);
      }
      return promise;
    });
    spyOn(promise, 'always').andReturn(function(callback, ctx) {
      callback.apply(ctx, options.args);
      return promise;
    });

    return promise;
  };


  return StubbedPromise;
});
