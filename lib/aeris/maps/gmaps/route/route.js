define([
  'aeris/collection',
  'aeris/promise',
  'aeris/util',
  'gmaps/route/waypoint',
  'gmaps/route/directions/googledirectionsservice',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/errors/jsonparseerror'
], function(Collection, Promise, _, Waypoint, DirectionsService, InvalidArgumentError, JSONParseError) {
  /**
   * A collection of {aeris.maps.gmaps.route.Waypoint} instances
   *
   * @class aeris.maps.gmaps.route.Route
   * @extends aeris.Collection
   *
   * @constructor
   * @override
   *
   * @param {Array.<aeris.maps.gmaps.route.Waypoint>=} opt_waypoints
   *
   * @param {Object} opt_options
   * @param {GoogleDirectionsService=} opt_options.directionsService
   *
   */
  var Route = function(opt_waypoints, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: Waypoint,
      directionsService: new DirectionsService()
    });


    /**
     * A unique client id
     *
     * @type {string}
     */
    this.cid = _.uniqueId('route_');


    /**
     *
     * @type {GoogleDirectionsService}
     * @private
     */
    this.directionsService_ = options.directionsService;


    /**
     * Distance of route in meters.
     *
     * @type {number}
     */
    this.distance = 0;


    Collection.call(this, opt_waypoints, opt_options);


    this.keepDistanceUpdated_();
    this.keepPathsUpdated_();

  };
  _.inherits(Route, Collection);


  /** @private */
  Route.prototype.keepDistanceUpdated_ = function() {
    var dirtyDistanceEvents = [
      'add', 'remove', 'change:distance', 'change:path', 'reset'
    ];

    this.listenTo(this, dirtyDistanceEvents.join(' '), function() {
      this.recalculateAndUpdateDistance();
    });

    this.listenTo(this, 'reset', function() {
      // Because our waypoints won't do it for us.
      this.trigger('change:distance')
    })
  };


  /** @private */
  Route.prototype.keepPathsUpdated_ = function() {
    this.listenTo(this, {
      'add change:position change:followDirections': function(waypoint) {
        this.updatePathsForExistingWaypoint_(waypoint);
      },
      remove: function(waypoint, route, options) {
        this.updatePathsForRemovedWaypoint_(waypoint, options.index);
      }
    });
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
  Route.prototype.atOffset = function(waypoint, offsetIndex) {
    var index;

    if (!this.contains(waypoint)) {
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
  Route.prototype.getPrevious = function(waypoint) {
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
  Route.prototype.getNext = function(waypoint) {
    return this.atOffset(waypoint, 1);
  };

  /**
   * Returns all selected waypoints.
   *
   * @return {Array.<aeris.maps.gmaps.route.Waypoint>}
   */
  Route.prototype.getSelected = function() {
    return this.where({ selected: true });
  };


  /**
   * Selects all of the route's waypoints.
   *
   * @param {Object=} opt_options
   *        Whether to trigger Waypoint#select and
   *        Route#waypoint:select events.
   *        Defaults to true.
   */
  Route.prototype.selectAll = function(opt_options) {
    this.invoke('select', opt_options);
  };


  /**
   * Deselects all of the route's waypoints.
   *
   * @param {Object=} opt_options
   *        Whether to trigger Waypoint#deselect and
   *        Route#waypoint:deselect events.
   *        Defaults to true.
   */
  Route.prototype.deselectAll = function(opt_options) {
    this.invoke('deselect', opt_options);
  };


  /**
   * Get the array of waypoints.
   *
   * @return {Array.<aeris.maps.gmaps.route.Waypoint>}
   */
  Route.prototype.getWaypoints = function() {
    return this.models;
  };


  /**
   * Get the last Waypoint in the Route.
   *
   * @return {aeris.maps.gmaps.route.Waypoint}
   */
  Route.prototype.getLastWaypoint = function() {
    return this.at(this.getWaypoints().length - 1);
  };

  /**
   * Exports the route as a JSON string.
   *
   * @return {string} JSON string representation of route.
   */
  Route.prototype.export = function() {
    return JSON.stringify(this);
  };


  /**
   * Import a JSON string array of waypoints
   *
   * @param {string} jsonStr
   * @param {Object} opt_options Option to pass to `reset`.
   */
  Route.prototype.import = function(jsonStr, opt_options) {
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
   * Recalculate the total distance
   * of all waypoints in the route.
   */
  Route.prototype.recalculateAndUpdateDistance = function() {
    var distance = this.reduce(function(distanceCount, waypoint) {
      return distanceCount + waypoint.getDistance();
    }, 0);

    this.setDistance_(distance);
  };


  Route.prototype.setDistance_ = function(distance) {
    var distanceHasNotChanged = (distance == this.distance);

    if (distanceHasNotChanged) { return; }

    this.distance = distance;

    this.trigger('change:distance', this, this.distance, {});
  };


  /**
   * Calculates the distance to a given
   * waypoint, from the start of the route.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {number}
   */
  Route.prototype.distanceTo = function(waypoint) {
    var distance = 0;

    if (!this.contains(waypoint)) {
      throw new InvalidArgumentError('Unable to calculate distance: ' +
        'Waypoint does not belong to route');
    }

    _.times(this.indexOf(waypoint) + 1, function(i) {
      distance += this.at(i).getDistance();
    }, this);

    return distance;
  };


  /**
   * Update the path of a waypoint, and surrounding waypoints
   * in the route as neccessary,
   * using an {aeris.maps.gmaps.route.directions.AbstractDirectionsService}
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @param {number} opt_index Index of the waypoint. Required if the waypoint does
   *                          was removed from this path.
   * @return {aeris.Promise} A promise to update the paths.
   */
  Route.prototype.updatePaths = function(waypoint, opt_index) {
    var promises = [];

    // Waypoint was added
    // or moved
    if (this.contains(waypoint)) {
      // Update the next waypoints path
      if (this.getNext(waypoint)) {
        promises.push(
          this.updatePathBetween(waypoint, this.getNext(waypoint))
        );
      }

      if (this.getPrevious(waypoint)) {
        promises.push(
          this.updatePathBetween(this.getPrevious(waypoint), waypoint)
        );
      }
    }

    // Waypoint was removed
    else {
      // Middle waypoint -->
      // Create path from previous waypoint to next waypoint
      if (this.at(opt_index - 1) && this.at(opt_index)) {
        promises.push(
          this.updatePathBetween(this.at(opt_index - 1), this.at(opt_index))
        );
      }

      // First Waypoint -->
      // Remove the next waypoint's path
      else if (this.at(opt_index)) {
        this.at(opt_index).set({
          path: [],
          distance: 0
        });
      }

      // Last Waypoint -->
      // No paths need to be updated
    }

    return aeris.Promise.when(promises);
  };


  /**
   * Update the path between two waypoints,
   * using a {aeris.maps.gmaps.route.directions.AbstractDirectionsService}
   *
   * @param {aeris.maps.gmaps.route.Waypoint} origin
   * @param {aeris.maps.gmaps.route.Waypoint} destination
   * @return {aeris.Promise} A Promise to return and update directions.
   */
  Route.prototype.updatePathBetween = function(origin, destination) {
    var options = {
      followDirections: destination.get('followDirections'),
      travelMode: destination.get('travelMode')
    };

    var promise = this.directionsService_.fetchPath(origin, destination, options);

    // Grab path data
    promise.
      done(function(res) {
        // Set the path data on the destination waypoint
        destination.set({
          path: res.path,
          position: res.path[res.path.length - 1],
          distance: res.distance
        });

        // Update the origin's geocoded lat/lng
        if (origin.getPosition() !== res.path[0]) {
          origin.set({
            position: res.path[0]
          });
        }
      }, this);

    return promise;
  };


  return _.expose(Route, 'aeris.maps.gmaps.route.Route');

});
