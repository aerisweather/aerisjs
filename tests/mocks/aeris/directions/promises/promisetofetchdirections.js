define(function() {
  var MockPromiseToFetchDirections = function() {
    var stubbedMethods = [
      'resolveWithPathAndDistance',
      'rejectUsingErrorObject'
    ];

    _.extend(this, jasmine.createSpyObj('mockPromiseToFetchDirections', stubbedMethods));
  };

  MockPromiseToFetchDirections.prototype.shouldResolveWithPath = function(path) {
    expect(this.getResolvedWithPath()).toEqual(path);
  };

  MockPromiseToFetchDirections.prototype.shouldResolveWithDistance = function(distance) {
    expect(this.getResolvedWithDistance()).toEqual(distance);
  };

  MockPromiseToFetchDirections.prototype.shouldRejectWithError = function(error) {
    expect(this.rejectUsingErrorObject).toHaveBeenCalledWith(error);
  };

  MockPromiseToFetchDirections.prototype.getResolvedWithPath = function() {
    return this.getResolvedWithArgs_()[0];
  };

  MockPromiseToFetchDirections.prototype.getResolvedWithDistance = function() {
    return this.getResolvedWithArgs_()[1];
  };

  MockPromiseToFetchDirections.prototype.getResolvedWithArgs_ = function() {
    return this.resolveWithPathAndDistance.mostRecentCall.args;
  };


  return MockPromiseToFetchDirections;
});
