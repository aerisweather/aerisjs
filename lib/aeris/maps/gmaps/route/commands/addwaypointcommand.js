/**
 * @fileoverview Defines the AddWaypointCommand class.
*/
define([
  'aeris',
  'aeris/emptypromise',
  'gmaps/route/commands/abstractroutecommand',
  'aeris/errors/invalidargumenterror',
  'vendor/underscore'
], function(aeris, EmptyPromise, AbstractRouteCommand, InvalidArgumentError, _) {
  aeris.provide('aeris.maps.gmaps.route.commands.AddWaypointCommand');


  /**
   *
   * @param {Object=} opt_options
   * @param {number} opt_options.at Index at which to add the waypoint.
   *                                Defaults to the end of the route.
   * @constructor
   * @extends {aeris.maps.gmaps.route.commands.AbstractRouteCommand}
   */
  aeris.maps.gmaps.route.commands.AddWaypointCommand = function(route, waypoint, opt_options) {
    var options;

    AbstractRouteCommand.call(this, route);

    // Set default options
    options = _.extend({
      at: this.route_.getWaypoints().length     // Defaults to end of route
    }, opt_options);

    this.newWaypoint_ = waypoint;

    this.index_ = options.at;
  };

  aeris.inherits(
    aeris.maps.gmaps.route.commands.AddWaypointCommand,
    AbstractRouteCommand
  );


  aeris.maps.gmaps.route.commands.AddWaypointCommand.prototype.execute_ = function() {
    this.route_.add(this.newWaypoint_, { at: this.index_});
    return new EmptyPromise();
  };

  aeris.maps.gmaps.route.commands.AddWaypointCommand.prototype.undo_ = function() {
    this.route_.remove(this.newWaypoint_);
    return new EmptyPromise();
  };


  return aeris.maps.gmaps.route.commands.AddWaypointCommand;
});
