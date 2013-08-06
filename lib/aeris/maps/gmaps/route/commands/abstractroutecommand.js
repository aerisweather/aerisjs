/**
 * @fileoverview Defines the AbstractRouteCommand abstract class.
*/
define([
  'aeris',
  'aeris/commands/abstractcommand',
  'gmaps/route/route',
  'aeris/errors/invalidargumenterror'
], function(aeris, AbstractCommand, Route, InvalidArgumentError) {
  aeris.provide('aeris.maps.gmaps.route.commands.AbstractRouteCommand');


  /**
   * AbstractRouteCommand
   *
   * Base class for all route commands.
   *
   * @extends {aeris.AbstractCommand}
   * @param {aeris.maps.gmaps.route.Route} route
   * @abstract
   * @constructor
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


    /**
     * Google's direction service used to determine a path when following paths
     * is enabled.
     *
     * @type {google.maps.DirectionsService}
     * @protected
     */
    this.googleDirectionsService_ = new google.maps.DirectionsService();
  };

  aeris.inherits(
    aeris.maps.gmaps.route.commands.AbstractRouteCommand,
    AbstractCommand
  );



  return aeris.maps.gmaps.route.commands.AbstractRouteCommand;
});
