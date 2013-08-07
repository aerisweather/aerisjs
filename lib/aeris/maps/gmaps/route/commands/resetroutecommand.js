/**
 * @fileoverview Defines the ResetRouteCommand class
*/
define([
  'aeris',
  'aeris/emptypromise',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/commands/abstractroutecommand',
  'gmaps/route/commands/addwaypointcommand',
  'gmaps/route/waypoint'
], function(aeris, EmptyPromise, InvalidArgumentError, AbstractRouteCommand, AddWaypointCommand, Waypoint) {
  aeris.provide('aeris.maps.gmaps.route.commands.ResetRouteCommand');


  /**
   * Replaces all waypoints in a route with new ones.
   *
   * @extends {aeris.maps.gmaps.route.commands.AbstractRouteCommand}
   *
   * @constructor
   * @param {Array<aeris.maps.gmaps.route.Waypoint>=} opt_waypoints New Waypoints to add to the route.
   * @param {Boolean=} opt_refresh Set to `true` to recalculate the provided waypoints' path and distance data.
   *
   * @override
   */
  aeris.maps.gmaps.route.commands.ResetRouteCommand = function(route, opt_waypoints) {
    AbstractRouteCommand.apply(this, arguments);

    this.oldWaypoints_ = null;

    this.waypoints_ = opt_waypoints || [];
  };

  aeris.inherits(
    aeris.maps.gmaps.route.commands.ResetRouteCommand,
    AbstractRouteCommand
  );


  /**
   * @override
   */
  aeris.maps.gmaps.route.commands.ResetRouteCommand.prototype.execute_ = function() {
    this.oldWaypoints_ = this.route_.getWaypoints();

    this.route_.reset(this.waypoints_);

    return new EmptyPromise();
  };


  /**
   * @override
   */
  aeris.maps.gmaps.route.commands.ResetRouteCommand.prototype.undo_ = function() {
    this.route_.reset(this.oldWaypoints_);

    return new EmptyPromise();
  };


  return aeris.maps.gmaps.route.commands.ResetRouteCommand;
});
