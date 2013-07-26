/**
 * @fileoverview Defines the AbstractRouteCommand abstract class.
*/
define([
  'aeris',
  'aeris/promise',
  'aeris/errors/unimplementedmethoderror',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/errors/commandhistoryerror',
  'gmaps/utils',
  'gmaps/route/route',
  'gmaps/route/waypoint'
], function(aeris, Promise, UnimplementedMethodError, InvalidArgumentError, CommandHistoryError, gUtils, Route, Waypoint) {
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
      throw new InvalidArgumentError('A RouteCommand requires a valid Route.');
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
    this.executePromise_ = new Promise();


    /**
     * A promise to undo the command's execution
     *
     * @type {aeris.promise}
     * @protected
     */
    this.undoPromise_ = new Promise();

    // Undo promise should start in a resolved state
    this.undoPromise_.resolve();


    /**
     * 1 = Execution requested (may not be complete)
     * 0 = Undo request (may not be complete)
     *    OR, no requests made
     * @type {number}
     */
    this.requestState_ = 0;


    /**
     * The state of the route before the command is
     * executed.
     *
     * @type {Array} JSON array of waypoints
     * @protected
     */
    this.previousRouteState_ = this.route_.toJSON();
  };


  /**
   * Execute the command.
   * wrapper around {aeris.maps.gmaps.route.commands.AbstractRouteCommand#execute_}
   *
   * @return {aeris.Promise} A promise to complete execution of the command.
   */
  aeris.maps.gmaps.route.commands.AbstractRouteCommand.prototype.execute = function() {
    if (this.requestState_ != 0) {
      throw new CommandHistoryError('Unable to execute command: command has already been executed');
    }

    // Wrap promise in a fresh execution promise
    this.executePromise_ = new Promise();

    this.requestState_ = 1;

    // Wait for undo, then execute
    this.undoPromise_.done(this.execute_, this);

    return this.executePromise_;
  };


  /**
   * Undo a command
   * wrapper around {aeris.maps.gmaps.route.commands.AbstractRouteCommand#undo_}
   *
   * @abstract
   * @return {aeris.Promise} A promise to complete the undo.
   */
  aeris.maps.gmaps.route.commands.AbstractRouteCommand.prototype.undo = function() {
    if (this.requestState_ !== 1) {
      throw new CommandHistoryError('Unable to undo command: command has not yet been executed');
    }

    // Create a fresh undo promise
    this.undoPromise_ = new Promise();

    this.requestState_ = 0;

    this.executePromise_.done(this.undo_, this);

    return this.undoPromise_;
  };


  /**
   * Handle the business logic of executing a command.
   * Must resolve this.executePromise_.
   *
   * @private
   * @abstract
   */
  aeris.maps.gmaps.route.commands.AbstractRouteCommand.prototype.execute_ = function() {
    throw new UnimplementedMethodError();
  };


  /**
   * Handle the business logic of undoing a command
   * Must resolve this.undoPromise_.
   *
   * @protected
   * @abstract
   */
  aeris.maps.gmaps.route.commands.AbstractRouteCommand.prototype.undo_ = function() {
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
