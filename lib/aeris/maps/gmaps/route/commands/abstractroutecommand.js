/**
 * @fileoverview Defines the AbstractRouteCommand abstract class.
*/
define([
  'aeris',
  'aeris/promise',
  'aeris/errors/UnimplementedMethodError',
  'aeris/errors/InvalidArgumentError',
  'gmaps/utils',
  'gmaps/route/route',
  'gmaps/route/waypoint'
], function(aeris, Promise, UnimplementedMethodError, InvalidArgumentError, gUtils, Route, Waypoint) {
  aeris.provide('aeris.maps.gmaps.route.commands.AbstractRouteCommand');


  /**
   * AbstractRouteCommand
   *
   *
   * @param {aeris.maps.gmaps.route.Route} route
   * @abstract
   * @constructor
   */
  aeris.maps.gmaps.route.commands.AbstractRouteCommand = function(route) {
    // Require route and waypoint
    if (!(route instanceof Route)) {
      throw new InvalidArgumentError('A RemoveWaypointCommand requires a valid Route.');
    }


    /**
     * The Route the Waypoint will be added to.
     *
     * @type {aeris.maps.gmaps.route.Route}
     * @protected
     */
    this.route_ = route;


    /**
     * Google's direction service used to determine a path when following paths
     * is enabled.
     *
     * @type {google.maps.DirectionsService}
     * @protected
     */
    this.googleDirectionsService_ = new google.maps.DirectionsService();

    /**
     * A promise to complete this commands execution.
     * Will remain pending while API services are being queried.
     *
     * @type {aeris.promise}
     * @protected
     */
    this.promise_ = new Promise();
  };


  /**
   * Execute the command.
   *
   * @abstract
   * @return {aeris.Promise} A promise to complete execution of the command.
   */
  aeris.maps.gmaps.route.commands.AbstractRouteCommand.prototype.execute = function() {
    throw new UnimplementedMethodError();
  };


  /**
   * Fetches path data from the Google Directions service
   *
   * @param {aeris.maps.gmaps.route.Waypoint} wpOrigin
   * @param {aeris.maps.gmaps.route.Waypoint} wpDestination
   * @return {aeris.promise} Resolves with {{ path: Array<Array>, distance: number }}.
   * @protected
   */
  aeris.maps.gmaps.route.commands.AbstractRouteCommand.prototype.fetchPath_ = function(wpOrigin, wpDestination) {
    var promise, routeRequest;

    if (!(wpOrigin instanceof Waypoint) || !(wpDestination instanceof Waypoint)) {
      throw new InvalidArgumentError('Unable to fetch path data: invalid waypoint provided');
    }

    promise = new Promise();

    routeRequest = {
      origin: gUtils.arrayToLatLng(wpOrigin.getLatLon()),
      destination: gUtils.arrayToLatLng(wpDestination.getLatLon()),
      travelMode: google.maps.TravelMode[wpDestination.travelMode]
    };

    this.googleDirectionsService_.route(routeRequest, function(response, status) {
      var path, distance;

      if (status !== google.maps.DirectionsStatus.OK) {
        promise.reject(response, status);
      }

      path = gUtils.latLngToPath(response.routes[0].overview_path);
      distance = response.routes[0].legs[0].distance.value;

      // Convert path to simple array
      for (var i = 0; i < path.length; i++) {
        path[i] = gUtils.latLngToArray(path[i]);
      }

      // resolve with (path, distance)
      promise.resolve(path, distance);
    });

    return promise;
  };


  /**
   * Calculates spherical distance between two waypoints
   * using the Google Geometry library.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} wpOrigin
   * @param {aeris.maps.gmaps.route.Waypoint} wpDestination
   * @return {number} Distance between the two waypoints.
   * @protected
   */
  aeris.maps.gmaps.route.commands.AbstractRouteCommand.prototype.calculateDirectDistance_ = function(wpOrigin, wpDestination) {
    return google.maps.geometry.spherical.computeDistanceBetween(
      gUtils.arrayToLatLng(wpOrigin.getLatLon()),
      gUtils.arrayToLatLng(wpDestination.getLatLon())
    );
  };



  return aeris.maps.gmaps.route.commands.AbstractRouteCommand;
});
