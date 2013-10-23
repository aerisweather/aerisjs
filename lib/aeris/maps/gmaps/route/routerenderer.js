define([
  'aeris/util',
  'aeris/config',
  'aeris/events',
  'gmaps/route/waypoint',
  'gmaps/route/route',
  'gmaps/utils',
  'aeris/errors/invalidargumenterror',
  'base/marker'
],
function(_, config, Events, Waypoint, Route, mapUtils, InvalidArgumentError, Marker) {
  /**
   * @typedef {Object} polylineOptions
   * @property {string=} strokeColor
   *                     Stroke color (any valid CSS color).
   *                     Defaults to '#36648b' (Calypso Blue)
   * @property {number=} strokeOpacity
   *                     Stroke opacity (1 is fully opaque).
   *                     Defaults to 0.8.
   * @property {number=} strokeWeight
   *                     Stroke weight, in pixels.
   *                     Defaults to 3.
   */
  /**
   * @typedef {Object} iconOptions
   * @property {string=} url
   *                     Path the the icon image file.
   * @property {number=} width
   *                     Width of the icon, in pixels.
   * @property {number=} height
   *                     Height of the icon, in pixels.
   * @property {Boolean=} clickable
   *                     Whether to allow click events on the icon.
   *                     Defaults to true.
   * @property {Boolean=} draggable
   *                     Whether to allow drag events on the icon.
   *                     Defaults to true.
   */

  /**
   * Create a Google Map extension used for rendering a Route.
   *
   * @constructor
   * @class RouteRenderer
   *
   * @param {Object=} opt_options
   *
   * @param {polylineOptions=} opt_options.path
   *                          Options for rendering a path's polyline.
   *
   * @param {polylineOptions=} opt_options.offPath
   *                          Options for rendering a path's polyline
   *                          When the path is not following directions.
   *                          Defaults to the same as a path following directions,
   *                          but with a strokeColor of '#dd0000' (Crimson Red).
   *
   * @param {iconOptions=} opt_options.waypoint
   *                          Options for a rending a waypoint's icon.
   *
   * @param {iconOptions=} opt_options.selectedWaypoint
   *                          Options for rendering a selected waypoint's icon.
   *                          Defaults to the same as a non-selected waypoint,
   *                          but with a different different color icon.
   *
   * @param {Function=} opt_options.Marker
   *                          The constructor for the marker to render.
   *                          Defaults to aeris.maps.Marker.
   *
   * @param {Function=} opt_options.Polyline
   *                          The constructor for the polyline to render.
   *                          Defaults to google.maps.Polyline
   *
   * @param {aeris.maps.Map} opt_options.map
   *
   * @mixes {aeris.Events}
   */
  var RouteRenderer = function(opt_options) {
    var options;

    opt_options || (opt_options = {});

    options = _.extend({
      path: _.extend({
        strokeColor: '#36648b',
        strokeOpacity: 0.8,
        strokeWeight: 3
      }, opt_options.path),
      offPath: _.extend({
        strokeColor: '#dd0000'
      }, opt_options.offPath),
      waypoint: _.extend({
        url: config.get('path') + 'assets/marker_grey.png',
        width: 20,
        height: 20,
        clickable: true,
        draggable: true
      }, opt_options.waypoint),
      selectedWaypoint: _.extend({
        url: config.get('path') + 'assets/marker_yellow.png'
      }, opt_options.selectedWaypoints),
      Marker: Marker,
      Polyline: google.maps.Polyline,
      map: null
    }, opt_options);

    // Default offPath to path
    options.offPath = _.defaults(options.offPath, options.path);

    // Default selectedWaypoint to waypoint
    options.selectedWaypoint = _.defaults(options.selectedWaypoint, options.waypoint);


    /**
     * @type {Function} {aeris.maps.Marker} constructor.
     * @private
     */
    this.Marker_ = options.Marker;


    /**
     * @type {Function} {google.maps.Polyline} constructor.
     * @private
     */
    this.Polyline_ = options.Polyline;


    /**
     * @type {polylineOptions}
     * @protected
     */
    this.pathOptions_ = options.path;


    /**
     * @type {polylineOptions}
     * @protected
     */
    this.offPathOptions_ = options.offPath;


    /**
     * @type {iconOptions}
     * @protected
     */
    this.waypointOptions_ = options.waypoint;


    /**
     * @type {iconOptions}
     * @protected
     */
    this.selectedWaypointOptions_ = options.selectedWaypoint;

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
     *      icon: aeris.maps.Marker
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


    /**
     * The map on which to render the route.
     *
     * @type {?aeris.maps.Map}
     * @private
     */
    this.map_;


    Events.call(this);

    this.setMap(options.map);
  };
  _.extend(
    RouteRenderer.prototype,
    Events.prototype
  );


  /**
   * Sets the map on which to render routes,
   * and renders all existing routes on the map.
   *
   * @param {aeris.maps.Map} map
   */
  RouteRenderer.prototype.setMap = function(map) {
    var mapView;
    this.map_ = map;

    // For our non-abstracted google Polyline friend.
    mapView = _.isNull(this.map_) ? null : this.map_.getView();

    _.each(this.routeViews_, function(waypoints, routeCid) {
      _.each(waypoints, function(waypointViews, waypointCid) {

        waypointViews.icon.setMap(this.map_);

        if (waypointViews.path) {
          // Remember, we're directly interacting with
          // a google Polyline object here...
          waypointViews.path.setMap(mapView);
        }

      }, this);
    }, this);
  };


  RouteRenderer.prototype.hasMap = function() {
    return !!this.map_;
  };



  /**
   * Render a new Waypoint on the map.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint The Waypoint to be
   *                                                   rendered.
   * @param {aeris.maps.gmaps.route.Route} route The route to which the waypoint belongs.
   */
  RouteRenderer.prototype.renderWaypoint = function(waypoint, route) {
    var pathView, iconView;

    // No Route/Waypoint provided
    if (!(waypoint instanceof Waypoint) || !(route instanceof Route)) {
      throw new InvalidArgumentError('Unable to renderWaypoint: invalid waypoint and/or route specified');
    }

    // Route doesn't own waypoint
    if (!route.has(waypoint)) {
      throw new InvalidArgumentError('Attempted to render a waypoint to a route which does not own the waypoint');
    }


    // Waypoint has already been rendered
    // --> Redraw
    if (this.routeViews_[route.cid] && this.routeViews_[route.cid][waypoint.cid]) {
      this.redrawWaypoint(waypoint, route);
      return;
    }

    // Draw the waypoint's path
    if (waypoint.path && waypoint.path.length) {
      pathView = this.renderPath(
        waypoint.path,
        waypoint.followDirections ? this.pathOptions_ : this.offPathOptions_
      );
    }

    // Draw an icon for the Waypoint
    iconView = this.renderMarker(
      waypoint.getLatLon(),
      waypoint.isSelected() ? this.selectedWaypointOptions_ : this.waypointOptions_
    );

    // Proxy the iconView's events
    this.proxyEvents(iconView, function(topic, args) {
      return {
        topic: 'waypoint:' + topic,
        args: [waypoint].concat(args)
      };
    });


    // Store views for later reference
    this.routeViews_[route.cid] || (this.routeViews_[route.cid] = {});
    this.routeViews_[route.cid][waypoint.cid] = {
      icon: iconView,
      path: pathView
    };
  };


  RouteRenderer.prototype.redrawWaypoint = function(waypoint, route) {
    this.eraseWaypoint(waypoint, route);
    this.renderWaypoint(waypoint, route);
  };


  RouteRenderer.prototype.renderRoute = function(route) {
    var waypoints = route.getWaypoints();

    for (var i = 0; i < waypoints.length; i++) {
      this.renderWaypoint(waypoints[i], route);
    }
  };


  /**
   * Draw a path on the map.
   *
   * @param {Array.<Array.<number>>} path The path to draw on the map.
   * @param {polylineOptions=} opt_options Style options for the path.
   *
   * @return {google.maps.Polyline}
   */
  RouteRenderer.prototype.renderPath = function(path, opt_options) {
    var options = opt_options || {};
    var polyline;

    // Convert path to google format
    path = mapUtils.pathToLatLng(path);

    polyline = new this.Polyline_({
      path: path,
      strokeColor: options.strokeColor,
      strokeOpacity: options.strokeOpacity,
      strokeWeight: options.strokeWeight
    });

    if (this.hasMap()) {
      polyline.setMap(this.map_.getView());
    }

    // Quick and dirty polyline event Drag event
    // -- a hack which works by listening
    // to the Polyline's mousedown,
    // and the map's mouseup
    // Otherwise, Polyline has no native
    // event for this type of drag
    google.maps.event.addListener(polyline, 'mousedown', function(evt) {
      self.map.getView().setOptions({ draggable: false });
      self.trigger('path:dragstart', waypoint, mapUtils.latLngToArray(evt.latLng));
      evt.stop();

      // Wait for mouseup on map
      // Because we're no longer mousing on the path
      google.maps.event.addListenerOnce(self.map.getView(), 'mouseup', function(evt) {
        self.map.getView().setOptions({ draggable: true });
        self.trigger('path:dragend', waypoint, mapUtils.latLngToArray(evt.latLng));
        evt.stop();
      });
    });

    // Path click event
    google.maps.event.addListener(polyline, 'click', function(evt) {
      var latLon = mapUtils.latLngToArray(evt.latLng);
      self.trigger('path:click', waypoint, latLon);
    });

    return polyline;
  };


  /**
   * Draw an icon on the map at the specified
   * latLon
   *
   * @param {Array} latLon
   * @param {iconOptions=} opt_options Style options for the icon.
   *
   * @return {aeris.maps.markers.Icon}
   */
  RouteRenderer.prototype.renderMarker = function(latLon, opt_options) {
    var options = opt_options || {};
    var icon = new this.Marker_({
      position: latLon,
      url: options.url,
      clickable: options.clickable,
      draggable: options.draggable
    });

    icon.setMap(this.map_);

    return icon;
  };

  /**
   * Erases all route views from the map
   */
  RouteRenderer.prototype.eraseAllRoutes = function() {
    // Loop through route views
    for (var routeId in this.routeViews_) {
      if (this.routeViews_.hasOwnProperty(routeId)) {
        this.eraseRoute(routeId);
      }
    }
  };


  /**
   * Erases a single route from the map
   *
   * @param {aeris.maps.gmaps.route.Route|number} route Route or Route's cid.
   */
  RouteRenderer.prototype.eraseRoute = function(route) {
    var routeId = route instanceof Route ? route.cid : route;

    if (!routeId) {
      throw new InvalidArgumentError('Unable to remove route: invalid route or route id');
    }

    if (!this.routeViews_[routeId]) {
      return; // nothing to do here...
    }

    // Loop through waypoint views
    for (var waypointId in this.routeViews_[routeId]) {
      if (this.routeViews_[routeId].hasOwnProperty(waypointId)) {
        this.eraseWaypoint(waypointId, routeId);
      }
    }

    delete this.routeViews_[routeId];
  };


  RouteRenderer.prototype.eraseWaypoint = function(waypoint, route) {
    var icon, path;
    var waypointId = waypoint instanceof Waypoint ? waypoint.cid : waypoint;
    var routeId = route instanceof Route ? route.cid : route;

    if (!waypointId || !routeId) {
      throw new InvalidArgumentError('Unable to remove waypoint: invalid waypoint or route');
    }
    if (!this.routeViews_[routeId] || !this.routeViews_[routeId][waypointId]) {
      return;  // nothing to do here...
    }

    // Find associated icon/path views
    icon = this.routeViews_[routeId][waypointId].icon;
    path = this.routeViews_[routeId][waypointId].path;


    // Stop proxying events
    icon.removeProxy();

    // Remove the icon from the map
    icon.setMap(null);

    // Marker may not have a path (eg. if first marker)
    if (path) {
      path.setMap(null);
      google.maps.event.clearInstanceListeners(path);
    }

    // Remove views from store
    delete this.routeViews_[routeId][waypointId].icon;
    delete this.routeViews_[routeId][waypointId].path;
    delete this.routeViews_[routeId][waypointId];
  };


  return _.expose(RouteRenderer, 'aeris.maps.gmaps.route.RouteRenderer');

});
