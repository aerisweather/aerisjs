define([
  'aeris',
  'aeris/errors/invalidargumenterror',
  'aeris/events',
  'gmaps/route/waypoint'
], function(aeris, InvalidArgumentError) {

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
  aeris.maps.gmaps.route.Route = function(opt_waypoints) {
    aeris.Events.call(this);


    /**
     * An ordered array of waypoints within the Route.
     *
     * @type {Array.<aeris.maps.gmaps.route.Waypoint>}
     * @private
     */
    this.waypoints_ = [];


    /**
     * Distance of route in meters.
     *
     * @type {number}
     */
    this.distance = 0;

    if (opt_waypoints) {
      this.reset(opt_waypoints);
    }
  };
  aeris.extend(aeris.maps.gmaps.route.Route.prototype, aeris.Events.prototype);


  /**
   * Add a waypoint to the route.
   *
   * @fires aeris.maps.gmaps.route.Route#add
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @param {Object=} opt_options
   * @param {Boolean} opt_options.trigger Whether to trigger an 'add' event.
   */
  aeris.maps.gmaps.route.Route.prototype.add = function(waypoint, opt_options) {
    opt_options || (opt_options = {});

    // Set the previous Waypoint if there is one.
    if (this.waypoints_.length > 0)
      waypoint.previous = this.waypoints_[this.waypoints_.length - 1];

    // Increment distance
    this.distance += waypoint.distance;

    // Add and trigger the waypoint
    this.waypoints_.push(waypoint);

    if (opt_options.trigger !== false) {
      this.trigger('add', waypoint);
    }

  };

  /**
   * Removes a specified waypoint from the route
   *
   * @fires aeris.maps.gmaps.route.Route#remove
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint The waypoint to remove.
   * @param {Object=} opt_options
   * @param {Boolean} opt_options.trigger Whether to trigger an 'add' event.
   */
  aeris.maps.gmaps.route.Route.prototype.remove = function(waypoint, opt_options) {
    var wpIndex = this.waypoints_.indexOf(waypoint);

    opt_options || (opt_options = {});

    if (wpIndex === -1) {
      throw new Error('Unable to remove waypoint: does not exist in route');
    }

    this.waypoints_.splice(wpIndex, 1);
    this.distance -= waypoint.distance;

    if (opt_options.trigger !== false) {
      this.trigger('remove', waypoint);
    }
  };


  /**
   * Get the array of waypoints.
   *
   * @return {Array.<aeris.maps.gmaps.route.Waypoint>}
   */
  aeris.maps.gmaps.route.Route.prototype.getWaypoints = function() {
    return this.waypoints_;
  };


  /**
   * Get the last Waypoint in the Route.
   *
   * @return {aeris.maps.gmaps.route.Waypoint}
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

    return exportedWaypoints;
  };


  aeris.maps.gmaps.route.Route.prototype.clearWaypoints_ = function() {
    this.waypoints_ = [];
    this.distance = 0;
  };


  aeris.maps.gmaps.route.Route.prototype.reset = function(opt_waypoints, opt_options) {
    var waypoints;

    if (opt_waypoints && !aeris.utils.isArray(opt_waypoints)) {
      throw new InvalidArgumentError('resetWaypoint must be called with an array of waypoints');
    }

    opt_options || (opt_options = {});
    waypoints = opt_waypoints || [];

    this.clearWaypoints_();

    // Add waypoints to route
    for (var i = 0; i < waypoints.length; i++) {
      var wp = waypoints[i];
      if (!(wp instanceof aeris.maps.gmaps.route.Waypoint)) {
        // Import from JSON
        wp = new aeris.maps.gmaps.route.Waypoint();
        wp.reset(waypoints[i]);
      }

      this.add(wp, { trigger: false });
    }

    if (opt_options.trigger !== false) {
      this.trigger('reset', this.getWaypoints());
    }
  };


  /**
   * Event triggered when a waypoint is added to the Route.
   *
   * @event aeris.maps.gmaps.route.Route#add
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
