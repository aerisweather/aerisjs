/**
 * @fileoverview Defines the AbstractRouteCommand abstract class.
*/
define([
  'aeris/util',
  'aeris/commands/abstractcommand',
  'strategy/route/route',
  'aeris/errors/invalidargumenterror'
], function(_, AbstractCommand, Route, InvalidArgumentError) {
  /**
   * AbstractRouteCommand
   *
   * Base class for all route commands.
   *
   * @class aeris.maps.gmaps.route.commands.AbstractRouteCommand
   * @extends {aeris.AbstractCommand}
   *
   * @param {aeris.maps.gmaps.route.Route} route
   * @abstract
   * @constructor
   */
  var AbstractRouteCommand = function(route) {
    AbstractCommand.call(this);


    this.validateRoute_(route);


    /**
     * The Route the Waypoint will be added to.
     *
     * @type {aeris.maps.gmaps.route.Route}
     * @protected
     */
    this.route_ = route;
  };

  _.inherits(AbstractRouteCommand, AbstractCommand);


  /**
   * @throws aeris.errors.InvalidArgumentError
   *
   * @param {aeris.maps.gmaps.route.Route} route
   * @private
   */
  AbstractRouteCommand.prototype.validateRoute_ = function(route) {
    if (!(route instanceof Route)) {
      throw new InvalidArgumentError('A RouteCommand requires a valid Route.');
    }
  };


  return AbstractRouteCommand;
});
