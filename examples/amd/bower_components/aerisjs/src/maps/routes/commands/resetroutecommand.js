define([
  'aeris/util',
  'aeris/emptypromise',
  'aeris/errors/invalidargumenterror',
  'aeris/maps/routes/commands/abstractroutecommand',
  'aeris/maps/routes/commands/addwaypointcommand',
  'aeris/maps/routes/waypoint'
], function(_, EmptyPromise, InvalidArgumentError, AbstractRouteCommand, AddWaypointCommand, Waypoint) {
  _.provide('aeris.maps.gmaps.route.commands.ResetRouteCommand');


  /**
   * Replaces all waypoints in a route with new ones.
   *
   * @extends aeris.maps.gmaps.route.commands.AbstractRouteCommand
   *
   * @constructor
   * @class ResetRouteCommand
   * @namespace aeris.maps.gmaps.route.commands
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

  _.inherits(
    aeris.maps.gmaps.route.commands.ResetRouteCommand,
    AbstractRouteCommand
  );


  /**
   * @override
   */
  aeris.maps.gmaps.route.commands.ResetRouteCommand.prototype.execute_ = function() {
    // Grab a hard copy of the old waypoints.
    this.oldWaypoints_ = this.route_.getWaypoints().slice();

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
