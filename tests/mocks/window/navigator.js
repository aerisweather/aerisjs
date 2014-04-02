define(['aeris/util'], function(_) {
  var root = this;

  var MockNavigator = function() {
    return {
      geolocation: new MockGeolocation()
    };
  };

  var MockGeolocation = function() {
    this.spyOnCallbackMethod_('getCurrentPosition').andCallThrough();
    this.spyOnCallbackMethod_('watchPosition').andCallThrough();
    this.spyOnCallbackMethod_('clearWatch').andCallThrough();
  };

  MockGeolocation.prototype.spyOnCallbackMethod_ = function(methodName) {
    var spy = spyOn(this, methodName);

    spy.resolve = _.bind(function() {
      this.resolveCallbackFor_(this[methodName], arguments);
    }, this);

    spy.reject = _.bind(function() {
      this.rejectCallbackFor_(this[methodName], arguments);
    }, this);

    spy.getOptions = _.bind(function() {
      return spy.mostRecentCall.args[2];
    });

    return spy;
  };

  MockGeolocation.prototype.getCurrentPosition = function(callback, errback, options) {
  };

  MockGeolocation.prototype.watchPosition = function(callback, errback, options) {
    return _.uniqueId('watchPosition_');
  };

  MockGeolocation.prototype.clearWatch = function(watchId) {
  };

  MockGeolocation.prototype.resolveCallbackFor_ = function(method, arguments) {
    this.invokeCallbackAt_(method, 0, arguments);
  };

  MockGeolocation.prototype.rejectCallbackFor_ = function(method, arguments) {
    this.invokeCallbackAt_(method, 1, arguments);
  };

  MockGeolocation.prototype.invokeCallbackAt_ = function(method, index, arguments) {
    var callback;
    this.ensureWasCalled(method);
    callback = method.mostRecentCall.args[index];
    callback.apply(root, arguments);
  };

  MockGeolocation.prototype.ensureWasCalled = function(spy) {
    if (!spy.callCount) {
      throw new Error('Expected spy ' + spy.id + ' to have been called');
    }
  };

  return MockNavigator;
});
