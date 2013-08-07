/**
 * @fileoverview Defines the ClearRouteCommand class.
*/
define([
  'aeris',
  'aeris/emptypromise',
  'aeris/utils',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/commands/abstractroutecommand'
], function(aeris, EmptyPromise, utils, InvalidArgumentError, AbstractRouteCommand) {
  aeris.provide('aeris.maps.gmaps.route.commands.ClearRouteCommand');


  /**
   * Removes all waypoints from a route.
   *
   * @extends {aeris.maps.gmaps.route.AbstractRouteCommand}
   * @constructor
   */
  aeris.maps.gmaps.route.commands.ClearRouteCommand = function(route) {
    AbstractRouteCommand.apply(this, arguments);


    /**
     * Waypoints that have been
     * cleared from the route.
     *
     * @type {Array.<aeris.maps.gmaps.route.Waypoint>}
     * @private
     */
    this.waypoints_ = null;
  };

  aeris.inherits(
    aeris.maps.gmaps.route.commands.ClearRouteCommand,
    AbstractRouteCommand
  );


  /**
   * @override
   */
  aeris.maps.gmaps.route.commands.ClearRouteCommand.prototype.execute_ = function() {
    this.waypoints_ = this.route_.getWaypoints();
    this.route_.reset();

    return new EmptyPromise();
  };


  /**
   * @override
   */
  aeris.maps.gmaps.route.commands.ClearRouteCommand.prototype.undo_ = function() {
    this.route_.reset(this.waypoints_);

    return new EmptyPromise();
  };

  return aeris.maps.gmaps.route.commands.ClearRouteCommand;
});
