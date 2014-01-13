define([
  'aeris/util',
  'routes/waypoint',
  'routes/errors/waypointnotinrouteerror'
], function(_, Waypoint, WaypointNotInRouteError) {
  /**
   * Helper class for reversing the order of waypoints
   * in a route.
   *
   * @class aeris.maps.gmaps.route.commands.helpers.RouteReverser
   *
   * @param {aeris.maps.gmaps.route.Route} route
   *
   * @param {Object=} opt_options
   * @param {Function=} opt_options.Waypoint
   *
   * @constructor
   */
  var RouteReverser = function(route, opt_options) {
    var options = _.defaults(opt_options || {}, {
      Waypoint: Waypoint
    });

    /**
     * @type {aeris.maps.gmaps.route.Route}
     * @private
     */
    this.route_ = route;


    /**
     * Constructor for creating a Waypoint.
     *
     * @type {Function}
     * @private
     */
    this.Waypoint_ = options.Waypoint;
  };


  /**
   * @return {Array.<aeris.maps.gmaps.route.Waypoint>}
   */
  RouteReverser.prototype.getRouteWaypointsInReverse = function() {
    var reverseWaypointsInSameOrder = this.route_.map(this.getWaypointInReverse, this);
    var reverseWaypointsInReverseOrder = reverseWaypointsInSameOrder.reverse();

    return reverseWaypointsInReverseOrder;
  };


  /**
   * A waypoint describes attributes of
   * the path which precedes it. So when a waypoint's
   * route changes directionality, that waypoint need to
   * change which path it's describing.
   *
   * @param waypoint
   * @return {aeris.maps.gmaps.route.Waypoint} A waypoint with reverse directionality.
   */
  RouteReverser.prototype.getWaypointInReverse = function(waypoint) {
    var waypointIsLastOrOnlyInRoute;
    var reverseWaypoint;

    this.ensureRouteHasWaypoint_(waypoint);

    waypointIsLastOrOnlyInRoute = !!this.route_.getNext(waypoint);

    if (!waypointIsLastOrOnlyInRoute) {
      reverseWaypoint = this.getLastOrOnlyWaypointInReverse_(waypoint);
    }
    else {
      reverseWaypoint = this.getMiddleOrFirstWaypointInReverse_(waypoint);
    }

    // We don't want our reverser adding
    // any knew waypoints to the map.
    reverseWaypoint.setMap(null);

    return reverseWaypoint;
  };


  /**
   * Consider:
   *
   *    FIRST --- MIDDLE --- LAST   (forward)
   *    LAST  --- MIDDLE --- FIRST  (reverse)
   *
   * The LAST waypoint, when reversed, has no path preceding it.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {aeris.maps.gmaps.route.Waypoint}
   * @private
   */
  RouteReverser.prototype.getLastOrOnlyWaypointInReverse_ = function(waypoint) {
    var pathDescribingAttributes;
    var reverseWaypointAttrs = {
      path: [],
      distance: 0,
      position: _.clone(waypoint.get('position'))
    };

    pathDescribingAttributes = this.getPathDescribingAttributesFrom_(waypoint);
    _.extend(reverseWaypointAttrs, pathDescribingAttributes);

    return this.cloneWaypointWithAttributes_(waypoint, reverseWaypointAttrs);
  };


  /**
   * Consider:
   *
   *    FIRST *** MIDDLE >>> LAST     (forward)
   *    LAST  >>> MIDDLE *** FIRST    (reverse)
   *
   * The path preceding MIDDLE changes to
   * the path which originally preceded LAST
   *
   * @param waypoint
   * @return {aeris.maps.gmaps.route.Waypoint}
   * @private
   */
  RouteReverser.prototype.getMiddleOrFirstWaypointInReverse_ = function(waypoint) {
    var pathDescribingAttributes;
    var nextWaypoint = this.route_.getNext(waypoint);
    var reverseWaypointAttributes = {
      path: this.getWaypointPathInReverse(nextWaypoint),
      distance: nextWaypoint.get('distance'),
      position: _.clone(waypoint.get('position'))
    };

    pathDescribingAttributes = this.getPathDescribingAttributesFrom_(nextWaypoint);
    _.extend(reverseWaypointAttributes, pathDescribingAttributes);

    return this.cloneWaypointWithAttributes_(waypoint, reverseWaypointAttributes);
  };


  /**
   * @param waypoint
   * @returns {Array.<Array.<number>>} Array of lat/lon coordinates.
   */
  RouteReverser.prototype.getWaypointPathInReverse = function(waypoint) {
    var path = _.clone(waypoint.get('path'));

    return path.reverse();
  };


  /**
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {Object} Path attribute, and attributes which describe the path.
   * @private
   */
  RouteReverser.prototype.getPathDescribingAttributesFrom_ = function(waypoint) {
    var pathDescribingAttributes = [
      'followDirections',
      'travelMode'
    ];

    return waypoint.pick(pathDescribingAttributes);
  };


  /**
   * Create a copy of a waypoint,
   * with the specified attributes.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @param {Object} attrs
   * @param {Boolean} opt_shouldValidate Default is true.
   *
   * @return {aeris.maps.gmaps.route.Waypoint}
   * @private
   */
  RouteReverser.prototype.cloneWaypointWithAttributes_ = function(waypoint, attrs, opt_shouldValidate) {
    var shouldValidate = _.isUndefined(opt_shouldValidate) ? true : opt_shouldValidate;
    var clone = waypoint.cloneUsingType(this.Waypoint_);

    clone.set(attrs, { validate: shouldValidate });

    return clone;
  };


  /**
   * @throw WaypointNotInRouteError
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @private
   */
  RouteReverser.prototype.ensureRouteHasWaypoint_ = function(waypoint) {
    var waypointId = _.isUndefined(waypoint.id) ? waypoint.cid : waypoint.id;

    if (!this.route_.contains(waypoint)) {
      throw new WaypointNotInRouteError('Route does not ' +
        'contain waypoint with id ' + waypointId);
    }
  };


  return RouteReverser;
});
