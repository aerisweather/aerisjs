define([
  'aeris/util',
  'aeris/commands/abstractcommand',
  'aeris/maps/routes/route',
  'aeris/errors/invalidargumenterror'
], function(_, AbstractCommand, Route, InvalidArgumentError) {
  /**
   * AbstractRouteCommand
   *
   * Base class for all route commands.
   *
   * @class AbstractRouteCommand
   * @namespace aeris.maps.gmaps.route.commands
   * @extends aeris.AbstractCommand
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
     * @property route_
     */
    this.route_ = route;
  };

  _.inherits(AbstractRouteCommand, AbstractCommand);


  /**
   * @throws aeris.errors.InvalidArgumentError
   *
   * @param {aeris.maps.gmaps.route.Route} route
   * @private
   * @method validateRoute_
   */
  AbstractRouteCommand.prototype.validateRoute_ = function(route) {
    if (!(route instanceof Route)) {
      throw new InvalidArgumentError('A RouteCommand requires a valid Route.');
    }
  };


  return AbstractRouteCommand;
});
