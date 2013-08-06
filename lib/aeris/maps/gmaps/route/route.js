define([
  'aeris',
  'aeris/utils',
  'vendor/underscore',
  'gmaps/route/waypoint',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/errors/jsonparseerror',
  'aeris/events'
], function(aeris, _, utils, Waypoint, InvalidArgumentError, JSONParseError) {

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
     * A has of events and  listeners to
     * bind to all child waypoints.
     *
     * @type {Object}
     * @private
     */
    this.waypointEvents_ = {
      'change:distance': this.recalculateDistance_,
      'change': this.triggerChildChange_
    };


    /**
     * Distance of route in meters.
     *
     * @type {number}
     */
    this.distance = 0;

    if (opt_waypoints) {
      if (!utils.isArray(opt_waypoints) || !(opt_waypoints[0] instanceof Waypoint)) {
        throw new InvalidArgumentError('Cannot construct Route: invalid waypoints object provided.');
      }
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
   * @param {number} opt_options.at Index at which to insert the waypoint.
   */
  aeris.maps.gmaps.route.Route.prototype.add = function(waypoint, opt_options) {
    var index;

    // Check that waypoint does already exist in route
    if (this.has(waypoint)) {
      throw new InvalidArgumentError('Cannot add waypoint: ' +
        'waypoint already exists in this route.');
    }

    opt_options || (opt_options = {});
    index = _.isUndefined(opt_options.at) ?
      this.waypoints_.length :                  // Default: add at the end
      opt_options.at;

    // Increment distance
    this.distance += waypoint.getDistance();

    // Add the waypoint
    this.waypoints_.splice(index, 0, waypoint);
    this.waypointsById_[waypoint.cid] = waypoint;

    this.bindWaypointEvents_(waypoint);

    if (opt_options.trigger !== false) {
      this.trigger('add', waypoint, this);
    }

  };


  /**
   * Returns a waypoint by client id.
   *
   * @param {string} cid Waypoint client id.
   * @return {aeris.maps.gmaps.route.Waypoint}
   */
  aeris.maps.gmaps.route.Route.prototype.get = function(cid) {
    return this.waypointsById_[cid];
  };


  /**
   * Returns a waypoint at the specified index
   * If route doesn't have waypoint, returns undefined.
   *
   * @param {number} index
   * @return {aeris.maps.gmaps.route.Waypoint|undefined}
   */
  aeris.maps.gmaps.route.Route.prototype.at = function(index) {
    return this.waypoints_[index];
  };


  /**
   * Returns the index of the given waypoint
   * within the route.
   *
   * Returns -1 if waypoint does not exist in route.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {number}
   */
  aeris.maps.gmaps.route.Route.prototype.indexOf = function(waypoint) {
    return this.getWaypoints().indexOf(waypoint);
  };


  /**
   * Does the waypoint exist in this route?
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {boolean}
   */
  aeris.maps.gmaps.route.Route.prototype.has = function(waypoint) {
    return this.indexOf(waypoint) !== -1;
  };


  /**
   * Returns a waypoint at an
   * index distance from the specified waypoint.
   *
   * For example:
   *  this.atOffset(waypoint, -2);
   *
   * would return the waypoint which is two befeore the
   * specified waypoint.
   *
   * If there's no waypoint at the
   * requested index, returns undefined.
   *
   * If the specified waypoint doesn't exist in the route,
   * throws an InvalidArgumentError
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @param {number} offsetIndex
   * @return {aeris.maps.gmaps.route.Waypoint|undefined}
   */
  aeris.maps.gmaps.route.Route.prototype.atOffset = function(waypoint, offsetIndex) {
    var index;

    if (!this.has(waypoint)) {
      throw new InvalidArgumentError('Unable to get previous waypoint: ' +
        'waypoint does not exist in this route');
    }

    index = this.indexOf(waypoint);
    return this.at(index + offsetIndex);
  };


  /**
   * Returns the waypoint before the specified waypoint.
   * If it's the first waypoint, returns undefined.
   * If the waypoint doesn't exist in the route,
   * throws an InvalidArgumentError
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {aeris.maps.gmaps.route.Waypoint|undefined}
   */
  aeris.maps.gmaps.route.Route.prototype.getPrevious = function(waypoint) {
    return this.atOffset(waypoint, -1);
  };


  /**
   * Returns the waypoint after the specified waypoint.
   * If it's the last waypoint, returns undefined.
   * If the waypoint doesn't exist in the route,
   * throws an InvalidArgumentError
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {aeris.maps.gmaps.route.Waypoint|undefined}
   */
  aeris.maps.gmaps.route.Route.prototype.getNext = function(waypoint) {
    return this.atOffset(waypoint, 1);
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

    this.distance -= waypoint.getDistance();

    this.unbindWaypointEvents_(waypoint);

    if (opt_options.trigger !== false) {
      this.trigger('remove', waypoint, wpIndex);
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
   * Binds events in this.waypointEvents_
   * to the specified waypoint.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @private
   */
  aeris.maps.gmaps.route.Route.prototype.bindWaypointEvents_ = function(waypoint) {
    for (var event in this.waypointEvents_) {
      if (this.waypointEvents_.hasOwnProperty(event)) {
        waypoint.on(event, this.waypointEvents_[event], this);
      }
    }
  };

  /**
   * Unbinds events in this.waypointEvents_
   * from the specified waypoint.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @private
   */
  aeris.maps.gmaps.route.Route.prototype.unbindWaypointEvents_ = function(waypoint) {
    for (var event in this.waypointEvents_) {
      if (this.waypointEvents_.hasOwnProperty(event)) {
        waypoint.off(event, this.waypointEvents_[event]);
      }
    }
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


  aeris.maps.gmaps.route.Route.prototype.recalculateDistance_ = function() {
    var distance = 0;
    var waypoints = this.getWaypoints();

    for (var i = 0; i < waypoints.length; i++) {
      distance += waypoints[i].getDistance();
    }

    this.distance = distance;
  };


  /**
   * Trigger a 'change:property' event
   * Whenever a child model (waypoint)
   * changes.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @private
   */
  aeris.maps.gmaps.route.Route.prototype.triggerChildChange_ = function(waypoint) {
    this.trigger('change', waypoint);
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
