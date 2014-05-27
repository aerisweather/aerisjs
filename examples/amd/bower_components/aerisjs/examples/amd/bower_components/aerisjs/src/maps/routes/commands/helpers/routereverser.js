define([
  'aeris/util',
  'aeris/maps/routes/waypoint',
  'aeris/maps/routes/errors/waypointnotinrouteerror'
], function(_, Waypoint, WaypointNotInRouteError) {
  /**
   * Helper class for reversing the order of waypoints
   * in a route.
   *
   * @class RouteReverser
   * @namespace aeris.maps.gmaps.route.commands.helpers
   *
   * @param {aeris.maps.gmaps.route.Route} route
   *
   * @constructor
   */
  var RouteReverser = function(route) {
    /**
     * @type {aeris.maps.gmaps.route.Route}
     * @private
     * @property route_
     */
    this.route_ = route;
  };


  /**
   * @return {Array.<aeris.maps.gmaps.route.Waypoint>}
   * @method getRouteWaypointsInReverse
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
   * @param {aeris.maps.routes.Waypoint} waypoint
   * @return {aeris.maps.gmaps.route.Waypoint} A waypoint with reverse directionality.
   * @method getWaypointInReverse
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
   * @method getLastOrOnlyWaypointInReverse_
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
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {aeris.maps.gmaps.route.Waypoint}
   * @private
   * @method getMiddleOrFirstWaypointInReverse_
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
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {aeris.maps.Path} Array of lat/lon coordinates.
   * @method getWaypointPathInReverse
   */
  RouteReverser.prototype.getWaypointPathInReverse = function(waypoint) {
    var path = _.clone(waypoint.get('path'));

    return path.reverse();
  };


  /**
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {Object} Path attribute, and attributes which describe the path.
   * @private
   * @method getPathDescribingAttributesFrom_
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
   * @method cloneWaypointWithAttributes_
   */
  RouteReverser.prototype.cloneWaypointWithAttributes_ = function(waypoint, attrs, opt_shouldValidate) {
    var shouldValidate = _.isUndefined(opt_shouldValidate) ? true : opt_shouldValidate;

    return waypoint.clone(attrs, { validate: shouldValidate });
  };


  /**
   * @throws WaypointNotInRouteError
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @private
   * @method ensureRouteHasWaypoint_
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
