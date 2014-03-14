define([
  'aeris/util',
  'aeris/promise',
  'aeris/maps/routes/commands/abstractroutecommand',
  'aeris/maps/routes/commands/helpers/routereverser'
], function(_, Promise, AbstractRouteCommand, RouteReverser) {
  /**
   * Reverses the order of waypoints and their direction in a route.
   *
   * @class ReverseRouteCommands
   * @namespace aeris.maps.gmaps.route.commands
   * @extends aeris.maps.gmaps.route.commands.AbstractRouteCommand
   *
   * @param {aeris.maps.gmaps.route.Route} route
   *
   * @param {Object=} opt_options
   * @param {aeris.maps.gmaps.route.commands.helpers.RouteReverser} opt_options.routeReverser
   *
   * @constructor
   */
  var ReverseRouteCommand = function(route, opt_options) {
    var options = opt_options || {};


    /**
     * Helper object for reversing route waypoints.
     *
     * @type {aeris.gmaps.route.commands.helpers.RouteReverser}
     * @private
     * @property routeReverser_
     */
    this.routeReverser_ = options.routeReverser || new RouteReverser(route);


    /**
     * Waypoints state before command execution.
     *
     * @type {?Array.<aeris.maps.gmaps.route.Waypoint>}
     * @private
     * @property waypointsOrig_
     */
    this.waypointsOrig_ = null;


    AbstractRouteCommand.call(this, route);
  };
  _.inherits(ReverseRouteCommand, AbstractRouteCommand);


  /**
   * @method execute_
   */
  ReverseRouteCommand.prototype.execute_ = function() {
    var promiseToExecute = new Promise();
    var reverseWaypoints;

    this.saveUndoState_();

    reverseWaypoints = this.getReverseWaypoints_();
    this.route_.reset(reverseWaypoints);

    promiseToExecute.resolve();

    return promiseToExecute;
  };


  /**
   * @method undo_
   */
  ReverseRouteCommand.prototype.undo_ = function() {
    var promiseToUndo = new Promise();

    this.route_.reset(this.waypointsOrig_);

    this.clearUndoState_;

    promiseToUndo.resolve();

    return promiseToUndo;
  };


  /**
   * Save the pre-execution state of
   * the route.
   *
   * @private
   * @method saveUndoState_
   */
  ReverseRouteCommand.prototype.saveUndoState_ = function() {
    var routeWaypoints = this.route_.getWaypoints();

    this.waypointsOrig_ = _.clone(routeWaypoints);
  };


  /**
   * Clear internal references to the pre-execution
   * state of the route.
   *
   * @private
   * @method clearUndoState_
   */
  ReverseRouteCommand.prototype.clearUndoState_ = function() {
    this.waypointsOrig_ = null;
  };


  /**
   * Return waypoints in reverse order and direction.
   *
   * @return {Array.<aeris.maps.gmaps.route.Waypoint>}
   * @private
   * @method getReverseWaypoints_
   */
  ReverseRouteCommand.prototype.getReverseWaypoints_ = function() {
    return this.routeReverser_.getRouteWaypointsInReverse();
  };


  return ReverseRouteCommand;
});
