/**
 * @fileoverview Defines the GoogleDirectionsService class.
 */
define([
  'aeris/util',
  'aeris/promise',
  'gmaps/utils',
  'gmaps/route/directions/abstractdirectionsservice'
], function(_, Promise, mapUtils, AbstractDirectionsService) {


  /**
   * A wrapper around the google directions service.
   *
   * @class GoogleDirectionsService
   * @extends {AbstractDirectionsService}
   *
   * @constructor
   */
  var GoogleDirectionsService = function() {
    AbstractDirectionsService.apply(this, arguments);

    this.service_ = new google.maps.DirectionsService();
  };
  _.inherits(
    GoogleDirectionsService,
    AbstractDirectionsService
  );


  /**
   * @override
   */
  GoogleDirectionsService.prototype.fetchDirectionsPath_ = function(origin, destination, options) {
    var promise = new aeris.Promise();
    var routeRequest = {
      origin: mapUtils.arrayToLatLng(origin.getPosition()),
      destination: mapUtils.arrayToLatLng(destination.getPosition()),
      travelMode: google.maps.TravelMode[options.travelMode]
    };
    var self = this;

    this.getServiceAPI().route(routeRequest, function(response, status) {
      var path, distance;

      // Check for response error
      if (status !== google.maps.DirectionsStatus.OK ||
        !response.routes.length
      ) {
        self.rejectPromise_(promise, status);
        return;
      }

      path = mapUtils.latLngToPath(response.routes[0].overview_path);
      distance = response.routes[0].legs[0].distance.value;

      self.resolvePromise_(promise, path, distance, status);
    });

    return promise;
  };


  /**
   * @override
   */
  GoogleDirectionsService.prototype.fetchDirectPath_ = function(origin, destination) {
    var promise = new aeris.Promise();
    var path = [
      origin.getPosition(),
      destination.getPosition()
    ];
    var distance = this.calculateDistance_(origin, destination);

    this.resolvePromise_(promise, path, distance);

    return promise;
  };


  /**
   * Calculates the direct distance
   * between two points
   *
   * @param {aeris.maps.gmaps.route.Waypoint} origin
   * @param {aeris.maps.gmaps.route.Waypoint} destination
   * @return {number} Distance in meters.
   * @private
   */
  GoogleDirectionsService.prototype.calculateDistance_ = function(origin, destination) {
    return google.maps.geometry.spherical.computeDistanceBetween(
      mapUtils.arrayToLatLng(origin.getPosition()),
      mapUtils.arrayToLatLng(destination.getPosition())
    );
  };


  /**
   * @override
   */
  GoogleDirectionsService.prototype.getSupportedTravelModes = function() {
    return [
      'WALKING',
      'BICYCLING',
      'DRIVING'
    ];
  };

  /**
   * @return {google.maps.DirectionsService}
   */
  GoogleDirectionsService.prototype.getServiceAPI = function() {
    return this.service_;
  };


  /**
   * Rejects a promise with a
   * {AbstractDirectionsService.Response} object
   *
   * @param {aeris.Promise} promise
   * @param {google.maps.DirectionsStatus} status
   * @private
   */
  GoogleDirectionsService.prototype.rejectPromise_ = function(promise, status) {
    var statusMap = {
      INVALID_REQUEST: AbstractDirectionsService.Status.API_ERROR,
      MAX_WAYPOINTS_EXCEEDED: AbstractDirectionsService.Status.API_ERROR,
      OVER_QUERY_LIMIT: AbstractDirectionsService.Status.API_ERROR,
      REQUEST_DENIED: AbstractDirectionsService.Status.API_ERROR,
      UNKNOWN_ERROR: AbstractDirectionsService.Status.API_ERROR,
      NOT_FOUND: AbstractDirectionsService.Status.NO_RESULTS,
      ZERO_RESULTS: AbstractDirectionsService.Status.NO_RESULTS
    };

    var response = new AbstractDirectionsService.Response({
      path: [],
      distance: -1,
      status: {
        code: statusMap[status],
        apiCode: status
      }
    });

    promise.reject(response);
  };


  /**
   * Resolved a promise with a
   * {AbstractDirectionsService.Response} object
   *
   * @param {aeris.Promise} promise
   * @param {Array.<Array>} path
   * @param {number} distance
   * @param {google.maps.DirectionsStatus} apiStatus
   * @private
   */
  GoogleDirectionsService.prototype.resolvePromise_ = function(promise, path, distance, apiStatus) {
    var response = new AbstractDirectionsService.Response({
      path: path,
      distance: distance,
      status: {
        code: AbstractDirectionsService.Status.OK,
        apiCode: apiStatus
      }
    });

    promise.resolve(response);
  };


  return _.expose(GoogleDirectionsService, 'aeris.maps.gmaps.route.directions.GoogleDirectionsService');
});

