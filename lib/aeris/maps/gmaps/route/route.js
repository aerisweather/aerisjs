define(['aeris', 'aeris/events'], function(aeris) {

  /**
   * @fileoverview Definition of a Route which primarily consists of an array
   *               of Waypoints.
   */


  aeris.provide('aeris.maps.gmaps.route.Route');


  /**
   * A collection of {aeris.maps.gmaps.route.Waypoint} instances
   *
   * @constructor
   * @extends {aeris.Events}
   */
  aeris.maps.gmaps.route.Route = function() {
    aeris.Events.call(this);


    /**
     * An ordered array of waypoints within the Route.
     *
     * @type {Array.<aeris.maps.gmap.route.Waypoint>}
     * @private
     */
    this.waypoints_ = [];


    /**
     * Distance of route in meters.
     *
     * @type {number}
     */
    this.distance = 0;

  };
  aeris.extend(aeris.maps.gmaps.route.Route.prototype, aeris.Events.prototype);


  /**
   * Add a waypoint to the route.
   *
   * @fires aeris.maps.gmaps.route.Route#addWaypoint
   * @param {aeris.maps.gmap.route.Waypoint}
   */
  aeris.maps.gmaps.route.Route.prototype.addWaypoint = function(waypoint) {

    // Set the previous Waypoint if there is one.
    if (this.waypoints_.length > 0)
      waypoint.previous = this.waypoints_[this.waypoints_.length - 1];

    // Increment distance
    this.distance += waypoint.distance;

    // Add and trigger the waypoint
    this.waypoints_.push(waypoint);
    this.trigger('addWaypoint', waypoint);

  };


  /**
   * Get the array of waypoints.
   *
   * @return {Array.<aeris.maps.gmap.route.Waypoint>}
   */
  aeris.maps.gmaps.route.Route.prototype.getWaypoints = function() {
    return this.waypoints_;
  };


  /**
   * Get the last Waypoint in the Route.
   *
   * @return {aeris.maps.gmap.route.Waypoint}
   */
  aeris.maps.gmaps.route.Route.prototype.getLastWaypoint = function() {
    var lastWaypoint = this.waypoints_.length > 0 ?
                       this.waypoints_[this.waypoints_.length - 1] :
                       null;
    return lastWaypoint;
  };


  aeris.maps.gmaps.route.Route.prototype.toJSON = function() {
    var waypoints = this.getWaypoints();
    var exportedWaypoints = [];

    // Loop through waypoints, and convert to JSON
    for (var i = 0, length = waypoints.length; i < length; i++) {
      exportedWaypoints.push(waypoints[i].toJSON());
    }

    return {
      distance: this.distance,
      waypoints: exportedWaypoints
    };
  };


  /**
   * Event triggered when a waypoint is added to the Route.
   *
   * @event aeris.maps.gmaps.route.Route#addWaypoint
   * @type {aeris.maps.gmaps.route.Waypoint}
   */


  /**
   * Event triggered when a waypoint is clicked.
   *
   * @event aeris.maps.gmaps.route.Route#click:waypoint
   * @type {aeris.maps.gmaps.route.Waypoint}
   */


  return aeris.maps.gmaps.route.Route;

});
