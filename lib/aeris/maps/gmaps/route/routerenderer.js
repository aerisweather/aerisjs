define(['aeris', 'base/extension/mapextension'], function(aeris) {

  /**
   * @fileoverview A Google Map extension for rendering a Route.
   */


  aeris.provide('aeris.maps.gmaps.route.RouteRenderer');


  /**
   * Create a Google Map extension used for rendering a Route.
   *
   * @constructor
   * @extends {aeris.maps.extension.MapExtension}
   */
  aeris.maps.gmaps.route.RouteRenderer = function(aerisMap, opt_options) {
    aeris.maps.extension.MapExtension.call(this, aerisMap, opt_options);

    var options = opt_options || {};


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
     * The Route being rendered.
     *
     * @type {aeris.maps.gmaps.route.Route}
     * @private
     */
    this.route_ = null;


    // Set the route if it was in the options.
    if (options.route)
      this.setRoute(options.route);

    // Overwrite any styles from the options.
    if (options.styles)
      aeris.extend(this.styles, options.styles);

  };
  aeris.inherits(aeris.maps.gmaps.route.RouteRenderer,
                 aeris.maps.extension.MapExtension);


  /**
   * Set the Route that is being rendered.
   *
   * @param {aeris.maps.gmap.route.Route} route The Route to be rendered.
   */
  aeris.maps.gmaps.route.RouteRenderer.prototype.setRoute = function(route) {

    // Clean up any listeners from a previous route.
    this.clearListeners_();

    // Set the route
    this.route_ = route;

    // Listen to Waypoints being added to the Route
    this.route_.on('addWaypoint', this.renderWaypoint, this);

  };


  /**
   * Render a new Waypoint on the map.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint The Waypoint to be
   *                                                   rendered.
   */
  aeris.maps.gmaps.route.RouteRenderer.prototype.renderWaypoint =
      function(waypoint) {


    if (waypoint.followPaths && waypoint.path)
      // If the Waypoint is following a path and the path exists,
      // draw the path.
      this.drawPath(waypoint.path)

    else if (waypoint.previous)
      // If there was no path to follow, but a previous Waypoint exists, draw
      // the path between the previous Waypoint and the new Waypoint.
      this.drawPath([waypoint.previous.getLatLon(), waypoint.getLatLon()], {
        strokeColor: this.styles.offPathStrokeColor
      });

  };


  /**
   * Draw a path on the map.
   *
   * @param {Array.<Array.<number>|google.maps.LatLng>} path The path to draw
   *     on the map.
   * @param {Object} opt_options Optional style options for the path.
   */
  aeris.maps.gmaps.route.RouteRenderer.prototype.drawPath =
      function(path, opt_options) {
    path = this.pathToLatLng_(path);
    var options = opt_options || {};
    var polyline = new google.maps.Polyline(aeris.extend({
      path: path,
      strokeColor: this.styles.strokeColor,
      strokeOpacity: this.styles.strokeOpacity,
      strokeWeight: this.styles.strokeWeight
    }, options));
    polyline.setMap(this.map);
  };


  /**
   * Clear all listeners.
   *
   * @private
   */
  aeris.maps.gmaps.route.RouteRenderer.prototype.clearListeners_ = function() {
    if (this.route_)
      this.route_.off('addWaypoint', this.addWaypoint, this);
  };


  /**
   * Ensure a path is an array of google.maps.LatLng objects.
   *
   * @param {Array.<Array.<number>|google.maps.LatLng>} path
   * @return {Array.<google.maps.LatLng>}
   * @private
   */
  aeris.maps.gmaps.route.RouteRenderer.prototype.pathToLatLng_ =
      function(path) {
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
