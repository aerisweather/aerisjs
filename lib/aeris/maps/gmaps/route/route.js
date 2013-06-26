define(['aeris', 'aeris/events'], function(aeris) {

  /**
   * @fileoverview Definition of a Route which primarily consists of an array
   *               of Waypoints.
   */


  aeris.provide('aeris.maps.gmaps.route.Route');


  /**
   * Create a new Route.
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
   * Event triggered when a waypoint is added to the Route.
   *
   * @event aeris.maps.gmaps.route.Route#addWaypoint
   * @type {aeris.maps.gmaps.route.Waypoint}
   */


  return aeris.maps.gmaps.route.Route;

});
