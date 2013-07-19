define([
  'aeris',
  'base/map',
  'gmaps/route/waypoint',
  'gmaps/route/route',
  'aeris/errors/invalidargumenterror',
  'base/extension/mapextension',
  'base/markers/icon'
],
function(aeris, AerisMap, Waypoint, Route, InvalidArgumentError) {

  /**
   * @fileoverview A Google Map extension for rendering a Route.
   */


  aeris.provide('aeris.maps.gmaps.route.RouteRenderer');


  /**
   * Create a Google Map extension used for rendering a Route.
   *
   * @constructor
   * @param {aeris.maps.Map} aerisMap
   * @param {Object} opt_options
   * @param {Object} opt_options.styles
   * @param {string} opt_options.style.strokeColor
   * @param {number} opt_options.style.strokeOpacity
   * @param {number} opt_options.style.strokeWeight
   * @param {number} opt_options.style.offPathStrokeColor
   *
   * @extends {aeris.maps.extension.MapExtension}
   */
  aeris.maps.gmaps.route.RouteRenderer = function(aerisMap, opt_options) {
    var options;

    if (!(aerisMap instanceof AerisMap)) {
      throw new InvalidArgumentError('RouteRenderer requires an AerisMap instance');
    }

    aeris.maps.extension.MapExtension.call(this, aerisMap, opt_options);

    options = opt_options || {};


    /**
     * An object of style values used for styling the display of the route.
     *
     * @type {Object}
     */
    this.styles = {
      'strokeColor': '#36648b',
      'strokeOpacity': 0.8,
      'strokeWeight': 3,
      'offPathStrokeColor': '#dd0000'
    };


    /**
     * Associates routes and waypoints
     * with their rendered {aeris.maps.MapExtensionObjects}.
     *
     * Allows RouteRenderer to manage the views it has created,
     * and provide an interface between data models and map views.
     *
     * Structure:
     * {
     *  'route_cid': {
     *    'waypoint_cid': {
     *      icon: aeris.maps.markers.Icon
     *      path: aeris.maps.layers.Polyline
     *    },
     *    'waypoint_cid2': {...}
     *  }
     *  'route_cid2': {...}
     *  ...
     * }
     *
     * @type {Object}
     * @private
     */
    this.routeViews_ = {};


    // Overwrite any styles from the options.
    if (options.styles)
      aeris.extend(this.styles, options.styles);

  };
  aeris.inherits(aeris.maps.gmaps.route.RouteRenderer,
                 aeris.maps.extension.MapExtension);



  /**
   * Render a new Waypoint on the map.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint The Waypoint to be
   *                                                   rendered.
   */
  aeris.maps.gmaps.route.RouteRenderer.prototype.renderWaypoint = function(waypoint, route) {
    var pathView, iconView;

    // No Route/Waypoint provided
    if (!(waypoint instanceof Waypoint) || !(route instanceof Route)) {
      throw new InvalidArgumentError('Unable to renderWaypoint: invalid waypoint and/or route specified');
    }

    // Route doesn't own waypoint
    if (!(route.get(waypoint.cid))) {
      throw new InvalidArgumentError('Attempted to render a waypoint to a route which does not own the waypoint');
    }


    // Waypoint has already been rendered
    if (this.routeViews_[route.cid] && this.routeViews_[route.cid][waypoint.cid]) {
      throw new InvalidArgumentError('Waypoint has already been rendered on this route');
    }

    // Draw a route with a path
    if (waypoint.followPaths && waypoint.path) {
      // If the Waypoint is following a path and the path exists,
      // draw the path.
      pathView = this.drawPath_(waypoint.path);
    }

    // Draw a route directly from the previous route (not following a path)
    else if (waypoint.previous) {
      // If there was no path to follow, but a previous Waypoint exists, draw
      // the path between the previous Waypoint and the new Waypoint.
      pathView = this.drawPath_([waypoint.previous.getLatLon(), waypoint.getLatLon()], {
        strokeColor: this.styles.offPathStrokeColor
      });
    }

    // Draw an icon for the Waypoint
    iconView = this.drawIcon_(waypoint.getLatLon());

    // Store views for later reference
    if (!this.routeViews_[route.cid]) {
      this.routeViews_[route.cid] = {};
    }
    this.routeViews_[route.cid][waypoint.cid] = {
      icon: iconView,
      path: pathView
    };
  };


  aeris.maps.gmaps.route.RouteRenderer.prototype.renderRoute = function(route) {
    var waypoints = route.getWaypoints();

    for (var i = 0; i < waypoints.length; i++) {
      this.renderWaypoint(waypoints[i], route);
    }
  };


  /**
   * Draw a path on the map.
   *
   * @param {Array.<Array.<number>>} path The path to draw on the map.
   * @param {Object} opt_options Optional style options for the path.
   *
   * @private
   * @return {google.maps.Polyline}
   */
  aeris.maps.gmaps.route.RouteRenderer.prototype.drawPath_ = function(path, opt_options) {
    path = this.pathToLatLng_(path);
    var options = opt_options || {};
    var polyline = new google.maps.Polyline(aeris.extend({
      path: path,
      strokeColor: this.styles.strokeColor,
      strokeOpacity: this.styles.strokeOpacity,
      strokeWeight: this.styles.strokeWeight
    }, options));

    polyline.setMap(this.map);

    return polyline;
  };


  /**
   * Draw an icon on the map at the specified
   * latLon
   *
   * @param {Array} latLon
   *
   * @private
   * @return {aeris.maps.markers.icon}
   */
  aeris.maps.gmaps.route.RouteRenderer.prototype.drawIcon_ = function(latLon) {
    var icon = new aeris.maps.markers.Icon(latLon,
        aeris.config.path + 'assets/wx-details-marker.png',
        20, 20
     );

    icon.setMap(this.aerisMap);

    return icon;
  };

  /**
   * Erases all route views from the map
   */
  aeris.maps.gmaps.route.RouteRenderer.prototype.removeAll = function() {
    // Loop through route views
    for (var routeId in this.routeViews_) {
      if (this.routeViews_.hasOwnProperty(routeId)) {
        this.removeRoute(routeId);
      }
    }
  };


  aeris.maps.gmaps.route.RouteRenderer.prototype.removeRoute = function(route) {
    var routeId = route instanceof Route ? route.cid : route;

    if (!routeId) {
      throw new InvalidArgumentError('Unable to remove route: invalid route or route id');
    }

    if (!this.routeViews_[routeId]) {
      throw new InvalidArgumentError('Unable to remove route: route has not been rendered');
    }

    // Loop through waypoint views
    for (var waypointId in this.routeViews_[routeId]) {
      var icon, path;
      if (this.routeViews_[routeId].hasOwnProperty(waypointId)) {

        icon = this.routeViews_[routeId][waypointId].icon;
        path = this.routeViews_[routeId][waypointId].path;

        icon.remove();

        // Marker may not have a path (eg. if first marker)
        if (path) {
          path.setMap(null);
        }

        delete this.routeViews_[routeId][waypointId].icon;
        delete this.routeViews_[routeId][waypointId].path;
      }
    }

    delete this.routeViews_[routeId];
  };


  /**
   * Ensure a path is an array of google.maps.LatLng objects.
   *
   * @param {Array.<Array.<number>|google.maps.LatLng>} path
   * @return {Array.<google.maps.LatLng>}
   * @private
   */
  aeris.maps.gmaps.route.RouteRenderer.prototype.pathToLatLng_ = function(path) {
    if (!(path[0] instanceof google.maps.LatLng)) {
      var latLngs = [];
      for (var i = 0, length = path.length; i < length; i++) {
        var latLon = path[i];
        latLngs.push(this.aerisMap.toLatLon(latLon));
      }
      path = latLngs;
    }
    return path;
  };


  return aeris.maps.gmaps.route.RouteRenderer;

});
