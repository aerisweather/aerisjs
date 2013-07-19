define([
  'aeris',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/errors/jsonparseerror',
  'aeris/events',
  'gmaps/route/waypoint'
], function(aeris, InvalidArgumentError, JSONParseError) {

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
     * A unique client id
     *
     * @type {string}
     */
    this.cid = aeris.utils.uniqueId('route_');


    /**
     * An ordered array of waypoints within the Route.
     *
     * @type {Array.<aeris.maps.gmaps.route.Waypoint>}
     * @private
     */
    this.waypoints_ = [];


    /**
     * An unordered object containing all waypoints within the Route
     * with the waypoint cid as keys
     *
     * @type {Object}
     * @private
     */
    this.waypointsById_ = {};


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
    this.waypointsById_[waypoint.cid] = waypoint;

    if (opt_options.trigger !== false) {
      this.trigger('add', waypoint, this);
    }

  };


  aeris.maps.gmaps.route.Route.prototype.get = function(cid) {
    return this.waypointsById_[cid];
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
    delete this.waypointsById_[waypoint.cid];

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

  /**
   * Converts route to a JSON object
   *
   * @return {Array} JSON representation of route.
   */
  aeris.maps.gmaps.route.Route.prototype.toJSON = function() {
    var waypoints = this.getWaypoints();
    var exportedWaypoints = [];

    // Loop through waypoints, and convert to JSON
    for (var i = 0, length = waypoints.length; i < length; i++) {
      exportedWaypoints.push(waypoints[i].toJSON());
    }

    return exportedWaypoints;
  };

  /**
   * Exports the route as a JSON string.
   *
   * @return {string} JSON string representation of route
   */
  aeris.maps.gmaps.route.Route.prototype.export = function() {
    return JSON.stringify(this);
  };


  /**
   * Import a JSON string array of waypoints
   *
   * @param {string} jsonStr
   * @param {Object} opt_options Option to pass to `reset`.
   */
  aeris.maps.gmaps.route.Route.prototype.import = function(jsonStr, opt_options) {
    var obj;
    try {
      obj = JSON.parse(jsonStr);
    }
    catch (e) {
      if (e instanceof window.SyntaxError) {
        throw new JSONParseError('Invalid json string');
      }
      throw e;
    }

    this.reset(obj, opt_options);
  };


  /**
   * Remove all waypoints from the route
   *
   * @private
   */
  aeris.maps.gmaps.route.Route.prototype.clearWaypoints_ = function() {
    this.waypoints_ = [];
    this.waypointsById_ = {};

    this.distance = 0;
  };


  /**
   * Reset a route with an array of waypoints
   * Calling reset without arguments will remove all waypoints.
   *
   * @param {Array<aeris.maps.gmaps.route.Waypoint>|Array<Object>} opt_waypoints
   *        Array of Waypoints, or JSON waypoint objects.
   * @param {Object} opt_options
   * @param {Boolean} opt_options.trigger Whether to trigger a 'reset' event.
   */
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
