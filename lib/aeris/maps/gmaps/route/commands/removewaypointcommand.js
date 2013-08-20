/**
 * @fileoverview Defines the RemoveWaypointCommand.
*/
define([
  'gmaps/route/commands/abstractroutecommand',
  'gmaps/route/route',
  'gmaps/route/waypoint',
  'gmaps/utils',
  'aeris/util',
  'aeris/emptypromise',
  'aeris/errors/invalidargumenterror'
], function(AbstractRouteCommand, Route, Waypoint, gUtils, utils, EmptyPromise, InvalidArgumentError) {

  _.provide('aeris.maps.gmaps.route.commands.RemoveWaypointCommand');


  aeris.maps.gmaps.route.commands.RemoveWaypointCommand = function(route, waypoint) {
    AbstractRouteCommand.apply(this, arguments);

    if (!(waypoint instanceof Waypoint)) {
      throw new InvalidArgumentError('A RemoveWaypointCommand requires a valid Waypoint.');
    }

    // Check that waypoint exists in route
    if (!route.has(waypoint)) {
      throw new InvalidArgumentError('Cannot remove waypoint, as it is not in the specified route.');
    }


    /**
     * The Waypoint being added to the Route.
     *
     * @type {aeris.maps.gmaps.route.Waypoint}
     * @private
     */
    this.waypoint_ = waypoint;


    /**
     * Index of the removed waypoint.
     * Saved so that we can undo, and put
     * it back in the right place.
     *
     * @type {number}
     * @private
     */
    this.index_ = null;
  };

  _.inherits(
    aeris.maps.gmaps.route.commands.RemoveWaypointCommand,
    AbstractRouteCommand
  );


  /**
   * @override
   */
  aeris.maps.gmaps.route.commands.RemoveWaypointCommand.prototype.execute_ = function() {
    this.index_ = this.route_.indexOf(this.waypoint_);
    this.route_.remove(this.waypoint_);

    return new EmptyPromise();
  };


  aeris.maps.gmaps.route.commands.RemoveWaypointCommand.prototype.undo_ = function() {
    this.route_.add(this.waypoint_, { at: this.index_ });

    return new EmptyPromise();
  };


  return aeris.maps.gmaps.route.commands.RemoveWaypointCommand;
});
