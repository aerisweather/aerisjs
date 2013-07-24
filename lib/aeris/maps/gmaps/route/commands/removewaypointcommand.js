/**
 * @fileoverview Defines the RemoveWaypointCommand.
*/
define([
  'aeris',
  'gmaps/route/commands/abstractroutecommand',
  'gmaps/route/route',
  'gmaps/route/waypoint',
  'gmaps/utils',
  'aeris/utils',
  'aeris/promise',
  'aeris/errors/invalidargumenterror'
], function(aeris, AbstractRouteCommand, Route, Waypoint, gUtils, utils, Promise, InvalidArgumentError) {

  aeris.provide('aeris.maps.gmaps.route.commands.RemoveWaypointCommand');


  aeris.maps.gmaps.route.commands.RemoveWaypointCommand = function(route, waypoint) {
    AbstractRouteCommand.apply(this, arguments);

    if (!(waypoint instanceof Waypoint)) {
      throw new InvalidArgumentError('A RemoveWaypointCommand requires a valid Waypoint.');
    }

    /**
     * The Waypoint being added to the Route.
     *
     * @type {aeris.maps.gmaps.route.Waypoint}
     * @private
     */
    this.waypoint_ = waypoint;
  };

  aeris.inherits(
    aeris.maps.gmaps.route.commands.RemoveWaypointCommand,
    AbstractRouteCommand
  );

  aeris.maps.gmaps.route.commands.RemoveWaypointCommand.prototype.execute = function() {
    var self = this;
    var next = this.getNextWaypoint_();
    var prev = this.getPrevWaypoint_();
    var subPromise = new Promise();

    switch (this.getWaypointPosition_()) {
      // First waypoint in route
      case 0:
        // Remove path from following waypoint
        if (next) {
          next.set({
            path: null,
            previous: null,
            distance: 0
          });
        }

        subPromise.resolve();
        break;

      // Middle waypoint in route
      case 1:
        if (this.waypoint_.followPaths) {
          this.fetchPath_(prev, next).done(function(path, distance) {
            next.set({
              previous: self.waypoint_.previous,
              path: path,
              distance: distance
            });

            subPromise.resolve();
          }).fail(function() {
            subPromise.reject(arguments);
          });
        }
        else {
          // Not following paths
          next.set({
            path: [prev.getLatLon(), next.getLatLon()],
            followPaths: false,
            distance: this.calculateDirectDistance_(prev, next)
          });

          subPromise.resolve();
        }
        break;

      // Last waypoint in route
      case 2:
        // Nothing much to do here, really.
        subPromise.resolve();
        break;
    }

    // Remove the waypoint once all the data is fetched
    // Then resolve master promise
    subPromise.done(function() {
      this.removeWaypointFromRoute_();
      this.promise_.resolve();
    }, this).fail(function() {
      this.promise_.reject();
    }, this);

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
   * @extends {aeris.maps.gmaps.route.commands.AbstractRouteCommand}
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


  return aeris.maps.gmaps.route.commands.RemoveWaypointCommand;
});
