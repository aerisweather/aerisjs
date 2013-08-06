/**
 * @fileoverview Defines the AddWaypointCommand class.
*/
define([
  'aeris',
  'aeris/promise',
  'gmaps/route/commands/abstractroutecommand',
  'aeris/errors/invalidargumenterror',
  'vendor/underscore'
], function(aeris, Promise, AbstractRouteCommand, InvalidArgumentError, _) {
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
    var promises = [];

    // Update the next waypoint
    if (this.getNext_()) {
      promises.push(
        this.updatePathBetween_(this.newWaypoint_, this.getNext_())
      );
    }

    // Update the added waypoint
    if (this.getPrev_()) {
      promises.push(
        this.updatePathBetween_(this.getPrev_(), this.newWaypoint_)
      );
    }

    // Wait for sub promises to resolve
    // Then add the waypoint to the route
    return Promise.when(promises).
      done(this.addWaypointToRoute_, this);
  };


  /**
   * Add the waypoint model to the route
   * before the nextWaypoint
   */
  aeris.maps.gmaps.route.commands.AddWaypointCommand.prototype.addWaypointToRoute_ = function() {
    this.route_.add(this.newWaypoint_, {
      at: this.index_
    });
  };


  /**
   * @return {aeris.maps.gmaps.route.Waypoint|undefined}
   *         The waypoint which will be before the inserted waypoint.
   */
  aeris.maps.gmaps.route.commands.AddWaypointCommand.prototype.getPrev_ = function() {
    return this.route_.at(this.index_ - 1);
  };


  /**
   * @return {aeris.maps.gmaps.route.Waypoint|undefined}
   *         The waypoint which will be after the inserted waypoint.
   */
  aeris.maps.gmaps.route.commands.AddWaypointCommand.prototype.getNext_ = function() {
    return this.route_.at(this.index_);
  };


  return aeris.maps.gmaps.route.commands.AddWaypointCommand;
});
