define([
  'aeris/util',
  'aeris/collection',
  'aeris/promise',
  'aeris/maps/routes/errors/waypointnotinrouteerror',
  'aeris/maps/routes/errors/jsonparseerror'
], function(_, Collection, Promise, WaypointNotInRouteError, JSONParseError) {
  /**
   * A collection of {aeris.maps.gmaps.route.Waypoint} instances
   *
   * @class Route
   * @namespace aeris.maps.gmaps.route
   * @extends aeris.Collection
   *
   * @constructor
   * @override
   *
   * @param {Array.<aeris.maps.gmaps.route.Waypoint>=} opt_waypoints
   * @param {Object=} opt_options
   */
  var Route = function(opt_waypoints, opt_options) {
    /**
     * A unique client id
     *
     * @type {string}
     * @property cid
     */
    this.cid = _.uniqueId('route_');


    /**
     * Distance of route in meters.
     *
     * @type {number}
     * @property distance
     */
    this.distance = 0;


    Collection.call(this, opt_waypoints, opt_options);


    this.keepDistanceUpdated_();
    this.keepPathsUpdated_();
  };
  _.inherits(Route, Collection);


  /**
   * @private
   * @method keepDistanceUpdated_
   */
  Route.prototype.keepDistanceUpdated_ = function() {
    var dirtyDistanceEvents = [
      'add', 'remove', 'change:distance', 'change:path', 'reset'
    ];

    this.listenTo(this, dirtyDistanceEvents.join(' '), function() {
      this.recalculateAndUpdateDistance();
    });

    this.listenTo(this, 'reset', function() {
      // Because our waypoints won't do it for us.
      this.trigger('change:distance');
    });
  };


  /**
   * @private
   * @method keepPathsUpdated_
   */
  Route.prototype.keepPathsUpdated_ = function() {
    this.listenTo(this, {
      'add change:position change:followDirections': function(waypoint) {
        this.updatePathsForExistingWaypoint_(waypoint);
      },
      'reset': this.ensurePathsForAllWaypoints_,
      'change:path': function(waypoint, path) {
        this.movePreviousWaypointToStartOfPath_(waypoint, path);
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
   * @throws {aeris.maps.gmaps.route.errors.WaypointNotInRouteError}
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @param {number} offsetIndex
   * @return {aeris.maps.gmaps.route.Waypoint|undefined}
   * @method atOffset
   */
  Route.prototype.atOffset = function(waypoint, offsetIndex) {
    var index;

    this.ensureHasWaypoint_(waypoint);

    index = this.indexOf(waypoint);
    return this.at(index + offsetIndex);
  };


  /**
   * Returns the waypoint before the specified waypoint.
   * If it's the first waypoint, returns undefined.
   *
   * @throws {aeris.maps.gmaps.route.errors.WaypointNotInRouteError}
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {aeris.maps.gmaps.route.Waypoint|undefined}
   * @method getPrevious
   */
  Route.prototype.getPrevious = function(waypoint) {
    return this.atOffset(waypoint, -1);
  };


  /**
   * Returns the waypoint after the specified waypoint.
   * If it's the last waypoint, returns undefined.
   *
   * @throws {aeris.maps.gmaps.route.errors.WaypointNotInRouteError}
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {aeris.maps.gmaps.route.Waypoint|undefined}
   * @method getNext
   */
  Route.prototype.getNext = function(waypoint) {
    return this.atOffset(waypoint, 1);
  };


  /**
   * Returns all selected waypoints.
   *
   * @return {Array.<aeris.maps.gmaps.route.Waypoint>}
   * @method getSelected
   */
  Route.prototype.getSelected = function() {
    return this.where({ selected: true });
  };

  /**
   * @return {Array.<aeris.maps.extensions.MapObjectInterface>}
   * @method getDeselected
   */
  Route.prototype.getDeselected = function() {
    return this.where({ selected: false });
  };


  /**
   * Selects all of the route's waypoints.
   *
   * @param {Object=} opt_options
   *        Whether to trigger Waypoint#select and
   *        Route#waypoint:select events.
   *        Defaults to true.
   * @method selectAll
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
   * @method deselectAll
   */
  Route.prototype.deselectAll = function(opt_options) {
    this.invoke('deselect', opt_options);
  };


  /**
   * @throws {aeris.maps.gmaps.route.errors.WaypointNotInRouteError}
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @method deselectAllExcept
   */
  Route.prototype.deselectAllExcept = function(waypoint) {
    var allExcept;

    this.ensureHasWaypoint_(waypoint);
    allExcept = this.getAllExcept_(waypoint);

    _.invoke(allExcept, 'deselect');
  };


  Route.prototype.getAllExcept_ = function(exceptWaypoint) {
    return this.reject(function(waypoint) {
      return waypoint === exceptWaypoint;
    });
  };


  /**
   * Get the array of waypoints.
   *
   * @return {Array.<aeris.maps.gmaps.route.Waypoint>}
   * @method getWaypoints
   */
  Route.prototype.getWaypoints = function() {
    return this.models;
  };


  /**
   * Get the last Waypoint in the Route.
   *
   * @return {aeris.maps.gmaps.route.Waypoint}
   * @method getLastWaypoint
   */
  Route.prototype.getLastWaypoint = function() {
    return this.at(this.getWaypoints().length - 1);
  };

  /**
   * Exports the route as a JSON string.
   *
   * @return {string} JSON string representation of route.
   * @method export
   */
  Route.prototype.export = function() {
    return JSON.stringify(this);
  };


  /**
   * Import a JSON string array of waypoints
   *
   * @param {string} jsonStr
   * @param {Object} opt_options Option to pass to `reset`.
   * @method import
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
   * @method recalculateAndUpdateDistance
   */
  Route.prototype.recalculateAndUpdateDistance = function() {
    var distance = this.reduce(function(distanceCount, waypoint) {
      return distanceCount + waypoint.getDistance();
    }, 0);

    this.setDistance_(distance);
  };


  Route.prototype.setDistance_ = function(distance) {
    var distanceHasNotChanged = (distance == this.distance);

    if (distanceHasNotChanged) {
      return;
    }

    this.distance = distance;

    this.trigger('change:distance', this, this.distance, {});
  };


  /**
   * Calculates the distance to a given
   * waypoint, from the start of the route.
   *
   * @throws {aeris.maps.gmaps.route.errors.WaypointNotInRouteError}
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {number}
   * @method distanceTo
   */
  Route.prototype.distanceTo = function(waypoint) {
    var distance = 0;

    this.ensureHasWaypoint_(waypoint);

    _.times(this.indexOf(waypoint) + 1, function(i) {
      distance += this.at(i).getDistance();
    }, this);

    return distance;
  };


  /**
   * Update paths on all waypoint in the route,
   * unless the waypoint already has a path set.
   *
   * @method ensurePathsForAllWaypoints_
   * @private
  */
  Route.prototype.ensurePathsForAllWaypoints_ = function() {
    this.each(function(waypoint) {
      var hasPath = waypoint.get('path') && waypoint.get('path').length;
      var prevWaypoint = this.getPrevious(waypoint);

      if (!hasPath && prevWaypoint) {
        this.updatePathBetween(prevWaypoint, waypoint);
      }
    }, this);
  };


  Route.prototype.updatePathsForExistingWaypoint_ = function(waypoint) {
    var prevWaypoint, nextWaypoint;

    this.ensureHasWaypoint_(waypoint);

    nextWaypoint = this.getNext(waypoint);
    prevWaypoint = this.getPrevious(waypoint);

    if (nextWaypoint) {
      this.updatePathBetween(waypoint, nextWaypoint);
    }
    if (prevWaypoint) {
      this.updatePathBetween(prevWaypoint, waypoint);
    }
  };


  Route.prototype.updatePathsForRemovedWaypoint_ = function(waypoint, removedFromIndex) {
    var nextWaypoint = this.at(removedFromIndex);
    var prevWaypoint = this.at(removedFromIndex - 1);

    var wasInMiddleOfRoute = nextWaypoint && prevWaypoint;
    var wasFirstInRoute = nextWaypoint && !prevWaypoint;
    var wasLastOrOnlyInRoute = !nextWaypoint;

    if (wasInMiddleOfRoute) {
      this.updatePathBetween(prevWaypoint, nextWaypoint);
    }
    else if (wasFirstInRoute) {
      this.setWaypointAsFirstInRoute_(nextWaypoint);
    }
    else if (wasLastOrOnlyInRoute) {
      // No paths need to be updated
    }
    else {
      throw Error('Unexpected waypoint position wihtin route');
    }
  };


  /**
   * Update the path between two waypoints,
   * using a {aeris.maps.gmaps.route.directions.AbstractDirectionsService}
   *
   * @param {aeris.maps.gmaps.route.Waypoint} origin
   * @param {aeris.maps.gmaps.route.Waypoint} destination
   * @return {aeris.Promise} A Promise to return and update directions.
   * @method updatePathBetween
   */
  Route.prototype.updatePathBetween = function(origin, destination) {
    var fromLatLon = origin.getPosition();

    destination.setPathStartsAt(fromLatLon);
  };


  /**
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @param {aeris.maps.Path} path
   * @private
   * @method movePreviousWaypointToStartOfPath_
   */
  Route.prototype.movePreviousWaypointToStartOfPath_ = function(waypoint, path) {
    var prevWaypoint = this.getPrevious(waypoint);

    if (prevWaypoint) {
      this.moveWaypointToStartOfPath_(prevWaypoint, path);
    }
  };


  /**
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @param {aeris.maps.Path} path
   * @private
   * @method moveWaypointToStartOfPath_
   */
  Route.prototype.moveWaypointToStartOfPath_ = function(waypoint, path) {
    waypoint.setPosition(path[0]);
  };


  Route.prototype.setWaypointAsFirstInRoute_ = function(waypoint) {
    waypoint.set({
      path: [],
      distance: 0
    }, { validate: true });
  };


  /**
   * @param {aeris.Model} waypoint
   * @throws {aeris.maps.gmaps.route.errors.WaypointNotInRouteError}
   * @private
   * @method ensureHasWaypoint_
   */
  Route.prototype.ensureHasWaypoint_ = function(waypoint) {
    if (!this.contains(waypoint)) {
      throw new WaypointNotInRouteError();
    }
  };


  return _.expose(Route, 'aeris.maps.gmaps.route.Route');

});
