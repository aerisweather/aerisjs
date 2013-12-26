define([
  'aeris/util',
  'directions/promise/promisetofetchdirections',
  'strategy/utils'
], function(_, PromiseToFetchDirections, mapUtil) {
  /**
   * A promise to fetch directions from the Google Directions API.
   *
   * @class aeris.directions.promise.PromiseToFetchGoogleDirections
   * @extends aeris.directions.promise.PromiseToFetchDirections
   *
   * @constructor
   * @override
   */
  var PromiseToFetchGoogleDirections = function() {
    PromiseToFetchDirections.apply(this, arguments);
  };
  _.inherits(PromiseToFetchGoogleDirections, PromiseToFetchDirections);


  /**
   * Resolve or reject the promise,
   * based on the response data from the
   * Google directions API
   *
   * @param {google.maps.DirectionsResults} response
   * @param {google.maps.DirectionsStatus} status
   */
  PromiseToFetchGoogleDirections.prototype.settleUsingResponse = function(response, status) {
    if (this.isSuccessStatus(status)) {
      this.resolveUsingResponse(response, status);
    }
    else if (this.isNoResultsStatus_(status)) {
      this.rejectBecauseNoResults(status);
    }
    else {
      this.rejectBecauseApiError(status);
    }
  };


  /**
   * @param {google.maps.DirectionsResults} response
   * @param {google.maps.DirectionsStatus} status
   */
  PromiseToFetchGoogleDirections.prototype.resolveUsingResponse = function(response, status) {
    var path = this.getPathFromResponse_(response);
    var distance = this.getDistanceFromResponse_(response);

    this.resolveWithPathAndDistance(path, distance, status);
  };


  /** @param {google.maps.DirectionsResults} response */
  PromiseToFetchGoogleDirections.prototype.getPathFromResponse_ = function(response) {
    var googleLatLngPath = response.routes[0].overview_path;

    return mapUtil.latLngToPath(googleLatLngPath);
  };


  /** @param {google.maps.DirectionsResults} response */
  PromiseToFetchGoogleDirections.prototype.getDistanceFromResponse_ = function(response) {
    return response.routes[0].legs[0].distance.value;
  };


  /** @param {google.maps.DirectionsStatus} status */
  PromiseToFetchGoogleDirections.prototype.isSuccessStatus = function(status) {
    return status === google.maps.DirectionsStatus.OK;
  };


  /** @param {google.maps.DirectionsStatus} status */
  PromiseToFetchGoogleDirections.prototype.isNoResultsStatus_ = function(status) {
    return status === google.maps.DirectionsStatus.ZERO_RESULTS;
  };


  return PromiseToFetchGoogleDirections;
});
