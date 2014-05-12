define([
  'aeris/util',
  'mocks/mockfactory',
  'aeris/promise',
  'aeris/events'
], function(_, MockFactory, Promise, Events) {
  /**
   * @class MockAnimationLayerLoader
   */
  var MockAnimationLayerLoader = MockFactory({
    name: 'MockAnimationLayerLoader',
    inherits: Events,
    methods: [
      'destroy'
    ],
    constructor: function() {
      this.createPromiseSpy_('load');
    }
  });

  MockAnimationLayerLoader.prototype.load = function() {
    return new Promise();
  };

  MockAnimationLayerLoader.prototype.createPromiseSpy_ = function(methodName) {
    var methodNotCalledError = new Error('Unable to resolve mock promise method: ' +
      methodName + ' method was never called');
    var throwMethodNotCalledError = function() {
      throw methodNotCalledError;
    };

    // Stub the spy,
    // and provide test methods for resolving the returned promise;
    var methodSpy = spyOn(this, methodName).andCallFake(function() {
      var promise = new Promise();

      methodSpy.andResolveWith = function(var_args) {
        promise.resolve.apply(promise, arguments);
      };
      methodSpy.andRejectWith = function(var_args) {
        promise.reject.apply(promise, arguments);
      };

      return promise;
    });

    methodSpy.andResolveWith = throwMethodNotCalledError;
    methodSpy.andRejectWith = throwMethodNotCalledError;

    return methodSpy;
  };

  MockAnimationLayerLoader.prototype.getLoadProgress = function() {
    return 0.12345;
  };


  return MockAnimationLayerLoader;
});
