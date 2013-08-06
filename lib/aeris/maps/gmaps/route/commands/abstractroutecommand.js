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
   * Base class for all route commands.
   * Handles invalid command requests.
   *  eg: attempting to undo a command that hasn't been
   *      executed will throw a CommandHistoryError.
   *
   * Proper use of {aeris.maps.gmaps.route.commands.CommandManager}
   * will help you avoid these types of errors.
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
     * Is an action currently in progress / unresolved?
     *
     * @type {boolean}
     * @private
     */
    this.requestPending_ = false;


    /**
     * 1 = Execution requested (may not be complete)
     * 0 = Undo request
     * -1 = No actions requested
     * @type {number}
     */
    this.requestState_ = -1;


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
   * Note that classes extending from {aeris.maps.gmaps.route.commands.AbstractRouteCommand}
   * should override the protected {aeris.maps.gmaps.route.commands.AbstractRouteCommand#execute_}
   * method, which is called by the public {aeris.maps.gmaps.route.commands.AbstractRouteCommand#execute}
   * method.
   *
   * @final
   * @return {aeris.Promise} A promise to complete execution of the command.
   */
  aeris.maps.gmaps.route.commands.AbstractRouteCommand.prototype.execute = function() {
    var promise = new Promise();

    // Because I keep passing in a callback here, instead of to .done()
    if (arguments.length) {
      throw new InvalidArgumentError('Execute does not expect any arguments.');
    }

    if (this.requestState_ === 1) {
      throw new CommandHistoryError('Unable to execute command: command has already been executed');
    }
    else if (this.requestPending_) {
      throw new CommandHistoryError('Unable to execute command: undo is still in progress');
    }

    this.requestState_ = 1;
    this.requestPending_ = true;

    // Execute command
    this.execute_().
      always(function() {
        this.requestPending_ = false;
      }, this).
      done(promise.resolve, promise).
      fail(promise.reject, promise);


    return promise;
  };


  /**
   * Undo a command
   * wrapper around {aeris.maps.gmaps.route.commands.AbstractRouteCommand#undo_}
   *
   * Note that classes extending from {aeris.maps.gmaps.route.commands.AbstractRouteCommand}
   * should override the protected {aeris.maps.gmaps.route.commands.AbstractRouteCommand#undo_}
   * method, which is called by the public {aeris.maps.gmaps.route.commands.AbstractRouteCommand#undo}
   * method.
   *
   * @final
   * @abstract
   * @return {aeris.Promise} A promise to complete the undo.
   */
  aeris.maps.gmaps.route.commands.AbstractRouteCommand.prototype.undo = function() {
    var promise = new Promise();

    // Because I keep passing in a callback here, instead of to .done()
    if (arguments.length) {
      throw new InvalidArgumentError('Undo does not expect any arguments.');
    }

    if (this.requestState_ !== 1) {
      throw new CommandHistoryError('Unable to undo command: command has not yet been executed');
    }
    else if (this.requestPending_) {
      throw new CommandHistoryError('Unable to undo command: command execution is still in progress.');
    }

    this.requestState_ = 0;
    this.requestPending_ = true;

    // Undo command
    this.undo_().
      always(function() {
        this.requestPending_ = false;
      }, this).
      done(promise.resolve, promise).
      fail(promise.reject, promise);

    return promise;
  };


  /**
   * Handle the business logic of executing a command.
   * Must return a {aeris.Promise}
   *
   * @private
   * @abstract
   * @return {aeris.Promise} A promise to execute the command.
   */
  aeris.maps.gmaps.route.commands.AbstractRouteCommand.prototype.execute_ = function() {
    throw new UnimplementedMethodError();
  };


  /**
   * Handle the business logic of undoing a command
   * Must return a {aeris.Promise}
   *
   * @protected
   * @abstract
   * @return {aeris.Promise} A promise to undo the command.
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

      if (
        status !== google.maps.DirectionsStatus.OK ||
        !response.routes.length
      ) {
        promise.reject(response, status);
        return;
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
