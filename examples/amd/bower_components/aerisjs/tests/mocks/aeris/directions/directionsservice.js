define([
  'aeris/util',
  'aeris/promise'
], function(_, Promise) {
  /** @implements {aeris.directions.DirectionsServiceInterface} */
  var MockDirectionsService = function() {
    var stubbedMethods = [
      'fetchPath'
    ];

    this.promiseToFetchDirections_ = null;

    _.extend(this, jasmine.createSpyObj('directionsService', stubbedMethods));

    this.fetchPath.andCallFake(_.bind(function() {
      this.promiseToFetchDirections_ = new Promise();

      return this.promiseToFetchDirections_;
    }, this));
  };


  MockDirectionsService.prototype.resolveFetchPathWith = function(var_args) {
    var args = _.argsToArray(arguments);
    this.promiseToFetchDirections_.resolve.apply(this.promiseToFetchDirections_, args);
  };

  MockDirectionsService.prototype.rejectFetchPathWith = function(var_args) {
    var args = _.argsToArray(arguments);
    this.promiseToFetchDirections_.reject.apply(this.promiseToFetchDirections_, args);
  };

  MockDirectionsService.prototype.shouldHaveFetchedPathFrom = function(origin) {
    expect(this.getFetchPathOrigin()).toEqual(origin);
  };

  MockDirectionsService.prototype.shouldHaveFetchedPathTo = function(destination) {
    expect(this.getFetchPathDestination()).toEqual(destination);
  };

  MockDirectionsService.prototype.shouldHaveFetchedPathWithTravelMode = function(travelMode) {
    expect(this.getFetchPathOptions().travelMode).toEqual(travelMode);
  };

  MockDirectionsService.prototype.getFetchPathOrigin = function() {
    return this.getFetchPathArgs_()[0];
  };


  MockDirectionsService.prototype.getFetchPathDestination = function() {
    return this.getFetchPathArgs_()[1];
  };


  MockDirectionsService.prototype.getFetchPathOptions = function() {
    return this.getFetchPathArgs_()[2];
  };


  MockDirectionsService.prototype.getFetchPathArgs_ = function() {
    return this.fetchPath.mostRecentCall.args;
  };

  return MockDirectionsService;
});
