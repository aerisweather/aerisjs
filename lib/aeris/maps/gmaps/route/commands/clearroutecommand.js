/**
 * @fileoverview Defines the ClearRouteCommand class.
*/
define([
  'aeris',
  'aeris/promise',
  'aeris/utils',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/commands/abstractroutecommand'
], function(aeris, Promise, utils, InvalidArgumentError, AbstractRouteCommand) {
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
  aeris.maps.gmaps.route.commands.ClearRouteCommand.prototype.execute_ = function() {
    var promise = new Promise();

    this.route_.reset();
    promise.resolve();

    return promise;
  };

  return aeris.maps.gmaps.route.commands.ClearRouteCommand;
});
