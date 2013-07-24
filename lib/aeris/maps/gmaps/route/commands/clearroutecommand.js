/**
 * @fileoverview Defines the ClearRouteCommand class.
*/
define([
  'aeris',
  'aeris/utils',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/commands/abstractroutecommand'
], function(aeris, utils, InvalidArgumentError, AbstractRouteCommand) {
  aeris.provide('aeris.maps.gmaps.route.commands.ClearRouteCommand');


  /**
   * Removes all waypoints from a route.
   *
   * @extends {aeris.maps.gmaps.route.AbstractRouteCommand}
   * @constructor
   */
  aeris.maps.gmaps.route.commands.ClearRouteCommand = function(route) {
    AbstractRouteCommand.apply(this, arguments);
  };

  aeris.inherits(
    aeris.maps.gmaps.route.commands.ClearRouteCommand,
    AbstractRouteCommand
  );


  /**
   * @override
   */
  aeris.maps.gmaps.route.commands.ClearRouteCommand.prototype.execute = function() {
    AbstractRouteCommand.prototype.execute.apply(this, arguments);

    this.route_.reset();
    this.promise_.resolve();

    return this.promise_;
  };

  return aeris.maps.gmaps.route.commands.ClearRouteCommand;
});
