define([
  'aeris/util',
  'aeris/promise',
  'aeris/maps/routes/commands/abstractroutecommand',
  'aeris/maps/routes/commands/helpers/routereverser'
], function(_, Promise, AbstractRouteCommand, RouteReverser) {
  /**
   * Adds a reversed verions of the route waypoints to the route,
   * omitting the last waypoints.
   *
   * AKA "Out-and-Back"
   *
   * Eg.
   *
   *    A --- B *** C >>> D
   *
   *    Becomes:
   *
   *    A --- B *** C >>> D <<< C *** B --- A
   *
   *
   * @param {aeris.maps.gmaps.route.Route} route
   *
   * @param {Object=} opt_options
   * @param {aeris.maps.gmaps.route.commands.helpers.RouteReverser} opt_options.routeReverser
   *
   *
   * @class AppendReverseRouteCommand
   * @namespace aeris.maps.gmaps.route.command
   * @extends aeris.maps.gmaps.route.command.AbstractRouteCommand
   *
   * @constructor
   */
  var AppendReverseRouteCommand = function(route, opt_options) {
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



    AbstractRouteCommand.apply(this, arguments);
  };
  _.inherits(AppendReverseRouteCommand, AbstractRouteCommand);


  /**
   * @method execute_
   */
  AppendReverseRouteCommand.prototype.execute_ = function() {
    var promiseToExecute = new Promise();

    this.saveUndoState_();

    this.appendReverseWaypointsToRoute_();

    promiseToExecute.resolve();

    return promiseToExecute;
  };


  /**
   * @method undo_
   */
  AppendReverseRouteCommand.prototype.undo_ = function() {
    var promiseToUndo = new Promise();

    this.removeAppendedWaypointsFromRoute_();

    this.clearUndoState_();

    promiseToUndo.resolve();

    return promiseToUndo;
  };


  /**
   * Save the pre-execution state of the route.
   *
   * @private
   * @method saveUndoState_
   */
  AppendReverseRouteCommand.prototype.saveUndoState_ = function() {
    var routeWaypoints = this.route_.getWaypoints();

    this.waypointsOrig_ = _.clone(routeWaypoints);
  };


  /**
   * Remove internal references to the pre-execution
   * state of the route.
   *
   * @private
   * @method clearUndoState_
   */
  AppendReverseRouteCommand.prototype.clearUndoState_ = function() {
    this.waypointsOrig_ = null;
  };


  /**
   * @private
   * @method appendReverseWaypointsToRoute_
   */
  AppendReverseRouteCommand.prototype.appendReverseWaypointsToRoute_ = function() {
    var reverseWaypoints = this.getReverseWaypointsWithoutFurthest_();
    this.route_.add(reverseWaypoints);
  };


  /**
   * @return {Array.<aeris.maps.gmaps.route.Waypoint>}
   * @private
   * @method getReverseWaypointsWithoutFurthest_
   */
  AppendReverseRouteCommand.prototype.getReverseWaypointsWithoutFurthest_ = function() {
    var furthesetWaypoint;
    var reverseWaypoints = this.getReverseWaypoints_();

    if (reverseWaypoints.length) {
      furthesetWaypoint = reverseWaypoints.shift();
      furthesetWaypoint.destroy();
    }

    return reverseWaypoints;
  };


  /**
   * @return {Array.<aeris.maps.gmaps.route.Waypoint>}
   * @private
   * @method getReverseWaypoints_
   */
  AppendReverseRouteCommand.prototype.getReverseWaypoints_ = function() {
    return this.routeReverser_.getRouteWaypointsInReverse();
  };


  /**
   * Remove waypoints from the route
   * which were appended by the command execution.
   *
   * @private
   * @method removeAppendedWaypointsFromRoute_
   */
  AppendReverseRouteCommand.prototype.removeAppendedWaypointsFromRoute_ = function() {
    if (_.isNull(this.waypointsOrig_)) {
      throw new Error('Unable to revert route state: no original route state ' +
        'can be found.');
    }

    this.route_.set(this.waypointsOrig_);
  };


  return AppendReverseRouteCommand;
});
