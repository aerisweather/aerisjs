/**
 * @fileoverview Defines the ResetRouteCommand class
*/
define([
  'aeris',
  'aeris/promise',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/commands/abstractroutecommand',
  'gmaps/route/commands/addwaypointcommand',
  'gmaps/route/waypoint'
], function(aeris, Promise, InvalidArgumentError, AbstractRouteCommand, AddWaypointCommand, Waypoint) {
  aeris.provide('aeris.maps.gmaps.route.commands.ResetRouteCommand');


  /**
   * Replaces all waypoints in a route with new ones.
   * This command DOES NOT calculate paths and distances.
   *
   * If you need to calculate a waypoints path and distance,
   * us the {aeris.maps.gmaps.route.commands.AddWaypointCommand}
   *
   * @extends {aeris.maps.gmaps.route.commands.AbstractRouteCommand}
   *
   * @constructor
   * @param {Array<aeris.maps.gmaps.route.Waypoint>=} opt_waypoints New Waypoints to add to the route.
   * @param {Boolean} opt_refresh Whether to recalculate path data.
   *
   * @override
   */
  aeris.maps.gmaps.route.commands.ResetRouteCommand = function(route, opt_waypoints, opt_refresh) {
    AbstractRouteCommand.apply(this, arguments);

    // Enforce waypoints type
    if (opt_waypoints && (
      !aeris.utils.isArray(opt_waypoints) ||
        !(opt_waypoints[0] instanceof Waypoint)
      )) {
      throw new InvalidArgumentError('Unable to reset route: invalid waypoints provided');
    }

    this.waypoints_ = opt_waypoints || [];

    this.refresh_ = opt_refresh || false;
  };

  aeris.inherits(
    aeris.maps.gmaps.route.commands.ResetRouteCommand,
    AbstractRouteCommand
  );


  aeris.maps.gmaps.route.commands.ResetRouteCommand.prototype.execute_ = function() {
    // Simple reset of route data
    if (!this.refresh_) {
      this.route_.reset(this.waypoints_);
      this.executePromise_.resolve();
    }
    else {
      this.addAllWaypoints_().
        done(this.executePromise_.resolve, this.executePromise_).
        fail(this.executePromise_.reject, this.executePromise_);
    }
  };

  /**
   * Add all waypoints to the route
   * using the {aeris.maps.gmaps.route.commands.AddWaypointCommand}
   *
   * @param {Array.<aeris.maps.gmaps.route.Waypoint>} opt_waypoints Defaults to this.waypoints_.
   * @return {aeris.Promise} A promise to add all waypoints.
   * @private
   */
  aeris.maps.gmaps.route.commands.ResetRouteCommand.prototype.addAllWaypoints_ = function(opt_waypoints) {
    var waypoints = opt_waypoints || this.waypoints_;
    var promises = [];

    for (var i = 0; i < waypoints.length; i++) {
      var addCommand = new AddWaypointCommand(this.route_, waypoints[i]);
      promises.push(addCommand.execute());
    }

    return Promise.when.apply(null, promises);
  };

  return aeris.maps.gmaps.route.commands.ResetRouteCommand;
});
