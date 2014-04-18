define([
  'aeris/util'
], function(_) {
  var MockPluginResolver = function() {
    var stubbedMethods = [
      'resolve',
      'reject'
    ];

    _.extend(this, jasmine.createSpyObj('resolver', stubbedMethods));
  };

  MockPluginResolver.prototype.shouldHaveRejectedWithErrorType = function(expectedType) {
    var errorType;
    this.shouldHaveRejected();

    errorType = this.getRejectArg().name;
    expect(errorType).toEqual(expectedType);
  }

  MockPluginResolver.prototype.shouldHaveResolvedWith = function(expectedArg) {
    this.shouldHaveResolved();
    expect(this.getResolveArg()).toEqual(expectedArg);
  };

  MockPluginResolver.prototype.shouldHaveResolved = function() {
    expect(this.resolve).toHaveBeenCalled();
    expect(this.reject).not.toHaveBeenCalled();
  };

  MockPluginResolver.prototype.shouldHaveRejected = function() {
    expect(this.reject).toHaveBeenCalled();
    expect(this.resolve).not.toHaveBeenCalled();
  };

  MockPluginResolver.prototype.getResolveArg = function() {
    return this.resolve.mostRecentCall.args[0];
  };

  MockPluginResolver.prototype.getRejectArg = function() {
    return this.reject.mostRecentCall.args[0];
  }

  return MockPluginResolver;
});
