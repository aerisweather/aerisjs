/**
 * @fileoverview Defines the ClearRouteCommand class.
*/
define([
  'aeris',
  'gmaps/route/commands/abstractroutecommand'
], function(aeris, AbstractRouteCommand) {
  aeris.provide('aeris.maps.gmaps.route.commands.ClearRouteCommand');

  aeris.maps.gmaps.route.commands.ClearRouteCommand = function(route) {
    AbstractRouteCommand.apply(this, arguments);
  };

  aeris.inherits(
    aeris.maps.gmaps.route.commands.ClearRouteCommand,
    AbstractRouteCommand
  );


  aeris.maps.gmaps.route.commands.ClearRouteCommand.prototype.execute = function() {
    this.route_.reset();
    this.promise_.resolve();

    return this.promise_;
  };

  return aeris.maps.gmaps.route.commands.ClearRouteCommand;
});
