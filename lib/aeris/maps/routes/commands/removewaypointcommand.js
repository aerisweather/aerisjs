define([
  'aeris/util',
  'aeris/promise',
  'aeris/maps/routes/commands/abstractroutecommand',
  'aeris/maps/routes/errors/waypointnotinrouteerror'
], function(_, Promise, AbstractRouteCommand, WaypointNotInRouteError) {
  var RemoveWaypointCommand = function(route, waypoint) {
    AbstractRouteCommand.apply(this, arguments);

    /**
     * The Waypoint being added to the Route.
     *
     * @type {aeris.maps.gmaps.route.Waypoint}
     * @private
     * @property waypoint_
     */
    this.waypoint_ = waypoint;


    /**
     * Index of the removed waypoint.
     * Saved so that we can undo, and put
     * it back in the right place.
     *
     * @type {number}
     * @private
     * @property index_
     */
    this.index_ = null;
  };

  _.inherits(RemoveWaypointCommand, AbstractRouteCommand);


  /**
   * @method execute_
   */
  RemoveWaypointCommand.prototype.execute_ = function() {
    var promiseToExecute = new Promise();

    this.ensureRouteHasWaypoint_();
    this.saveUndoState_();

    this.route_.remove(this.waypoint_);

    promiseToExecute.resolve();

    return promiseToExecute;
  };


  RemoveWaypointCommand.prototype.ensureRouteHasWaypoint_ = function() {
    if (!this.route_.contains(this.waypoint_)) {
      throw new WaypointNotInRouteError();
    }
  };


  RemoveWaypointCommand.prototype.saveUndoState_ = function() {
    this.index_ = this.route_.indexOf(this.waypoint_);
  };


  RemoveWaypointCommand.prototype.undo_ = function() {
    var promiseToUndo = new Promise();

    this.route_.add(this.waypoint_, { at: this.index_ });

    this.clearUndoState_();

    promiseToUndo.resolve();

    return promiseToUndo;
  };


  RemoveWaypointCommand.prototype.clearUndoState_ = function() {
    this.index_ = null;
  };


  return RemoveWaypointCommand;
});
