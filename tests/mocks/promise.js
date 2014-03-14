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
   * @param {Array} opt_options.args Arguments to pass the callbacks.
   * @param {number} opt_options.delay Delay in ms before calling callback.
   * @return {aeris.Promise} Mock promise object.
   *
   * @constructor
   * @class MockPromise
   */
  var StubbedPromise = function(opt_options) {
    var promise = sinon.createStubInstance(Promise);

    var options = _.extend({
      resolve: false,
      args: [],
      delay: 0
    }, opt_options);

    var spyMethod = options.resolve ? 'done' : 'fail';
    var resolvedState = options.resolve ? 'resolved' : 'rejected';

    var callCallback = function(fn, args, ctx) {
      var partialFn = _.bind.apply(_, [fn, ctx].concat(args));
      if (opt_options.delay) {
        window.setTimeout(partialFn, opt_options.delay);
      }
      else {
        partialFn();
      }
    };

    spyOn(promise, 'getState').andReturn('pending');

    // Setup chains
    spyOn(promise, 'done').andReturn(promise);
    spyOn(promise, 'fail').andReturn(promise);
    spyOn(promise, 'always').andReturn(promise);

    promise[spyMethod].andCallFake(function(callback, ctx) {
      callCallback(callback, options.args, ctx);
      promise.getState.andReturn(resolvedState);
      return promise;
    });
    promise.always.andCallFake(function(callback, ctx) {
      callCallback(callback, options.args, ctx);
      promise.getState.andReturn(resolvedState);
      return promise;
    });

    return promise;
  };


  return StubbedPromise;
});
