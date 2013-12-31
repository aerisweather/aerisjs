define([
  'strategy/utils'
], function(mapUtil) {
  var MockDirectionsService = function() {
    var stubbedMethods = [
      'route'
    ];

    _.extend(this, jasmine.createSpyObj('googleDirectionsApi', stubbedMethods));
  };

  MockDirectionsService.prototype.shouldHaveRequestedWithDestinationLatLon = function(latLon) {
    var requestLatLon = mapUtil.latLngToArray(this.getRequestDestination());

    expect(requestLatLon).toEqual(latLon)
  };

  MockDirectionsService.prototype.shouldHaveRequestedWithOriginLatLon = function(latLon) {
    var requestLatLon = mapUtil.latLngToArray(this.getRequestOrigin());

    expect(requestLatLon).toEqual(latLon)
  };

  MockDirectionsService.prototype.shouldHaveRequestedWithOrigin = function(origin) {
    expect(this.getRequestOrigin()).toEqual(origin);
  };


  MockDirectionsService.prototype.shouldHaveRequestedWithDestination = function(destination) {
    expect(this.getRequestDestination()).toEqual(destination);
  };


  MockDirectionsService.prototype.shouldHaveRequestedWithTravelMode = function(travelMode) {
    expect(this.getRequestTravelMode()).toEqual(travelMode);
  };


  MockDirectionsService.prototype.getRequestOrigin = function() {
    return this.getRequest().origin;
  };


  MockDirectionsService.prototype.getRequestDestination = function() {
    return this.getRequest().destination;
  };


  MockDirectionsService.prototype.getRequestTravelMode = function() {
    return this.getRequest().travelMode;
  };


  MockDirectionsService.prototype.getRequest = function() {
    return this.getRouteArgs_()[0];
  };


  MockDirectionsService.prototype.resolveRequestWith = function(response, status) {
    var callback = this.getRequestCallback_();
    callback(response, status);
  };

  MockDirectionsService.prototype.getRequestCallback_ = function() {
    return this.getRouteArgs_()[1];
  };


  MockDirectionsService.prototype.getRouteArgs_ = function() {
    return this.route.mostRecentCall.args;
  };


  return MockDirectionsService;
});