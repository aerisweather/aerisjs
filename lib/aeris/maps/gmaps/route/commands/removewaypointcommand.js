/**
 * @fileoverview Defines the RemoveWaypointCommand.
*/
define([
  'aeris',
  'gmaps/route/route',
  'gmaps/route/waypoint',
  'gmaps/utils',
  'aeris/utils',
  'aeris/promise',
  'aeris/errors/invalidargumenterror',
  'aeris/errors/apiresponseerror'
], function(aeris, Route, Waypoint, gUtils, utils, Promise, InvalidArgumentError, APIResponseError) {

  aeris.provide('aeris.maps.gmaps.route.commands.RemoveWaypointCommand');


  aeris.maps.gmaps.route.commands.RemoveWaypointCommand = function(route, waypoint) {

    // Require route and waypoint
    if (!(route instanceof Route)) {
      throw new InvalidArgumentError('A RemoveWaypointCommand requires a valid Route.');
    }
    if (!(waypoint instanceof Waypoint)) {
      throw new InvalidArgumentError('A RemoveWaypointCommand requires a valid Waypoint.');
    }


    /**
     * The Route the Waypoint will be added to.
     *
     * @type {aeris.maps.gmaps.route.Route}
     * @private
     */
    this.route_ = route;


    /**
     * The Waypoint being added to the Route.
     *
     * @type {aeris.maps.gmaps.route.Waypoint}
     * @private
     */
    this.waypoint_ = waypoint;


    /**
     * Google's direction service used to determine a path when following paths
     * is enabled.
     *
     * @type {google.maps.DirectionsService}
     * @private
     */
    this.googleDirectionsService_ = new google.maps.DirectionsService();


    /**
     * A promise to complete this commands execution.
     * Will remain pending while API services are being queried.
     *
     * @type {aeris.promise}
     * @private
     */
    this.promise_ = new Promise();
  };


  aeris.maps.gmaps.route.commands.RemoveWaypointCommand.prototype.execute = function() {
    var self = this;
    var next = this.getNextWaypoint_();
    var prev = this.getPrevWaypoint_();

    switch (this.getWaypointPosition_()) {
      // First waypoint in route
      case 0:
        this.updateWaypoint_(next, {
          path: null,
          previous: null,
          distance: 0
        });

        this.promise_.resolve();
        break;

      // Middle waypoint in route
      case 1:
        if (this.waypoint_.followPaths) {
          this.fetchPath_(prev, next).done(function(pathData) {
            self.updateWaypoint_(next, {
              previous: self.waypoint_.previous,
              path: pathData.path,
              distance: pathData.distance
            });

            self.promise_.resolve();
          });
        }
        else {
          // Not following paths
          this.updateWaypoint_(next, {
            path: [prev.getLatLon(), next.getLatLon()],
            followPaths: false,
            distance: this.calculateDirectDistance_(prev, next)
          });

          this.promise_.resolve();
        }
        break;

      // Last waypoint in route
      case 2:
        // Nothing much to do here, really.
        break;
    }


    this.removeWaypointFromRoute_();

    return this.promise_;
  };


  /**
   * Returns position of waypoint in route.
   *
   * @private
   *
   * @param {aeris.maps.gmaps.route.Route=} route Defaults to this.route_.
   * @param {aeris.maps.gmaps.route.Waypoint=} waypoint Defaults to this.waypoint_.
   * @return {number} 0 = first waypoint, 1 = middle waypoint, 2 = last waypoint.
   */
  aeris.maps.gmaps.route.commands.RemoveWaypointCommand.prototype.getWaypointPosition_ = function(route, waypoint) {
    var routeWaypoints;

    route || (route = this.route_);
    waypoint || (waypoint = this.waypoint_);

    routeWaypoints = route.getWaypoints();

    if (routeWaypoints.indexOf(waypoint) === 0) {
      return 0;
    }
    else if (routeWaypoints.indexOf(waypoint) === (routeWaypoints.length - 1)) {
      return 2;
    }
    else {
      return 1;
    }
  };

  /**
   * Removes the waypoint model from the route collection.
   *
   * @param {aeris.maps.gmaps.route.Route=} route Defaults to this.route_.
   * @param {aeris.maps.gmaps.route.Waypoint=} waypoint Defaults to this.route_.
   * @private
   */
  aeris.maps.gmaps.route.commands.RemoveWaypointCommand.prototype.removeWaypointFromRoute_ = function(route, waypoint) {
    route || (route = this.route_);
    waypoint || (waypoint = this.waypoint_);

    route.remove(waypoint);
  };


  /**
   * Returns the previous waypoint in the route.
   * If the waypoint is the first in the route,
   * returns false;
   *
   * @private
   *
   * @param {aeris.maps.gmaps.route.Route=} route
   * @param {aeris.maps.gmaps.route.Waypoint=} waypoint
   * @return {aeris.maps.gmaps.route.Waypoint|Boolean}
   */
  aeris.maps.gmaps.route.commands.RemoveWaypointCommand.prototype.getPrevWaypoint_ = function(route, waypoint) {
    var index;

    route || (route = this.route_);
    waypoint || (waypoint = this.waypoint_);

    index = route.getWaypoints().indexOf(waypoint);

    return this.getWaypointPosition_(route, waypoint) === 0 ? false : route.at(index - 1);
  };


  /**
   * Returns the following waypoint in the route.
   * If the waypoint is the last in the route,
   * returns false;
   *
   * @private
   *
   * @param {aeris.maps.gmaps.route.Route=} route
   * @param {aeris.maps.gmaps.route.Waypoint=} waypoint
   * @return {aeris.maps.gmaps.route.Waypoint|Boolean}
   */
  aeris.maps.gmaps.route.commands.RemoveWaypointCommand.prototype.getNextWaypoint_ = function(route, waypoint) {
    var index;

    route || (route = this.route_);
    waypoint || (waypoint = this.waypoint_);

    index = route.getWaypoints().indexOf(waypoint);

    return this.getWaypointPosition_(route, waypoint) === 2 ? false : route.at(index + 1);
  };


  aeris.maps.gmaps.route.commands.RemoveWaypointCommand.prototype.updateWaypoint_ = function(waypoint, attrs) {
    waypoint || (waypoint = this.waypoint_);

    if (!utils.isObject(attrs)) {
      throw new InvalidArgumentError('Invalid attributes object');
    }

    for (var prop in attrs) {
      if (attrs.hasOwnProperty(prop)) {
        if (prop === 'distance') {
          waypoint.setDistance(attrs[prop]);
        }
        else if (!(prop in waypoint)) {
          throw new InvalidArgumentError('Waypoint has no property \'' + prop + '\'');
        }

        waypoint[prop] = attrs[prop];
      }
    }
  };

  aeris.maps.gmaps.route.commands.RemoveWaypointCommand.prototype.fetchPath_ = function(wpOrigin, wpDestination) {
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
      if (status !== google.maps.DirectionsStatus.OK) {
        throw new APIResponseError('Google Directions Service responded with error: ' + status);
      }

      promise.resolve({
        path: response.routes[0].overview_path,
        distance: response.routes[0].legs[0].distance.value
      });
    });

    return promise;
  };


  aeris.maps.gmaps.route.commands.RemoveWaypointCommand.prototype.calculateDirectDistance_ = function(wpOrigin, wpDestination) {
    return google.maps.geometry.spherical.computeDistanceBetween(
      gUtils.arrayToLatLng(wpOrigin.getLatLon()),
      gUtils.arrayToLatLng(wpDestination.getLatLon())
    );
  };


  return aeris.maps.gmaps.route.commands.RemoveWaypointCommand;
});
