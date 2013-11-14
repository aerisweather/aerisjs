/**
 * @fileoverview Define the MoveWaypointCommand
*/
define([
  'aeris/util',
  'gmaps/route/commands/abstractroutecommand',
  'aeris/emptypromise'
], function(_, AbstractRouteCommand, EmptyPromise) {

  var MoveWaypointCommand = function(route, waypoint, latLon) {
    AbstractRouteCommand.call(this, route);


    /**
     * The waypoint we're moving.
     *
     * @type {aeris.maps.gmaps.route.Waypoint}
     * @private
     */
    this.waypoint_ = waypoint;


    /**
     * The latLon to move to.
     *
     * @type {Array.<Array>}
     * @private
     */
    this.newLatLon_ = latLon;


    /**
     * The original latLon of the waypoint,
     * for purposes of undoing.
     *
     * @type {Array.<Array>}
     * @private;
     */
    this.originalLatLon_;
  };
  _.inherits(
    MoveWaypointCommand,
    AbstractRouteCommand
  );


  /**
   * @override
   */
  MoveWaypointCommand.prototype.execute_ = function() {
    this.originalLatLon_ = this.waypoint_.get('position').slice(0);

    this.waypoint_.set({
      position: this.newLatLon_
    });

    return new EmptyPromise();
  };


  /**
   * @override
   */
  MoveWaypointCommand.prototype.undo_ = function() {
    this.waypoint_.set({
      position: this.originalLatLon_
    });

    return new EmptyPromise();
  };


  return _.expose(MoveWaypointCommand, 'aeris.maps.gmaps.route.commands.MoveWaypointCommand');;
});
