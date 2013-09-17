/**
 * @fileoverview Defines the AbstractRouteCommand abstract class.
*/
define([
  'aeris/util',
  'aeris/commands/abstractcommand',
  'gmaps/route/route',
  'aeris/errors/invalidargumenterror'
], function(_, AbstractCommand, Route, InvalidArgumentError) {
  _.provide('aeris.maps.gmaps.route.commands.AbstractRouteCommand');


  /**
   * AbstractRouteCommand
   *
   * Base class for all route commands.
   *
   * @extends {aeris.AbstractCommand}
   * @param {aeris.maps.gmaps.route.Route} route
   * @abstract
   * @constructor
   * @class aeris.maps.gmaps.route.commands.AbstractRouteCommand
   */
  aeris.maps.gmaps.route.commands.AbstractRouteCommand = function(route) {
    AbstractCommand.call(this);

    // Require route and waypoint
    if (!(route instanceof Route)) {
      throw new InvalidArgumentError('A RouteCommand requires a valid Route.');
    }


    /**
     * The Route the Waypoint will be added to.
     *
     * @type {aeris.maps.gmaps.route.Route}
     * @protected
     */
    this.route_ = route;
  };

  _.inherits(
    aeris.maps.gmaps.route.commands.AbstractRouteCommand,
    AbstractCommand
  );


  return aeris.maps.gmaps.route.commands.AbstractRouteCommand;
});
