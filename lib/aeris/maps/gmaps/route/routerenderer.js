define([
  'aeris/util',
  'aeris/events',
  'gmaps/route/waypoint',
  'gmaps/route/route',
  'gmaps/utils',
  'aeris/errors/invalidargumenterror',
  'base/markers/icon'
],
function(_, Events, Waypoint, Route, mapUtils, InvalidArgumentError) {

  /**
   * @fileoverview A Google Map extension for rendering a Route.
   */


  _.provide('aeris.maps.gmaps.route.RouteRenderer');

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
   * @class aeris.maps.gmaps.route.RouteRenderer
   * @param {aeris.maps.Map} aerisMap
   * @param {Object=} opt_options
   * @param {polylineOptions=} opt_options.path
   *                          Options for rendering a path's polyline.
   * @param {polylineOptions=} opt_options.offPath
   *                          Options for rendering a path's polyline
   *                          When the path is not following directions.
   *                          Defaults to the same as a path following directions,
   *                          but with a strokeColor of '#dd0000' (Crimson Red).
   * @param {iconOptions=} opt_options.waypoint
   *                          Options for a rending a waypoint's icon.
   * @param {iconOptions=} opt_options.selectedWaypoint
   *                          Options for rendering a selected waypoint's icon.
   *                          Defaults to the same as a non-selected waypoint,
   *                          but with a different different color icon.
   *
   * @mixes {aeris.Events}
   */
  aeris.maps.gmaps.route.RouteRenderer = function(aerisMap, opt_options) {
    var optionDefaults, options;

    opt_options = _.extend({
      path: {},
      offPath: {},
      waypoint: {},
      selectedWaypoint: {}
    }, opt_options);

    // Set default options
    optionDefaults = {
      path: {
        strokeColor: '#36648b',
        strokeOpacity: 0.8,
        strokeWeight: 3
      },
      offPath: {
        strokeColor: '#dd0000'
      },
      waypoint: {
        url: _.config.path + 'assets/marker_grey.png',
        width: 20,
        height: 20,
        clickable: true,
        draggable: true
      },
      selectedWaypoint: {
        url: _.config.path + 'assets/marker_yellow.png'
      }
    };

    // Process opt_options param
    // Underscore doesn't support
    // a deep extend...
    options = {
      path: _.extend({},
        optionDefaults.path,
        opt_options.path
      ),
      offPath: _.extend({},
        optionDefaults.path,
        optionDefaults.offPath,
        opt_options.offPath
      ),
      waypoint: _.extend({},
        optionDefaults.waypoint,
        opt_options.waypoint
      ),
      selectedWaypoint: _.extend({},
        optionDefaults.waypoint,
        optionDefaults.selectedWaypoint,
        opt_options.selectedWaypoint
      )
    };

    Events.call(this);


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
  };
  _.extend(
    aeris.maps.gmaps.route.RouteRenderer.prototype,
    Events.prototype
  );



  /**
   * Render a new Waypoint on the map.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint The Waypoint to be
   *                                                   rendered.
   * @param {aeris.maps.gmaps.route.Route} route The route to which the waypoint belongs.
   */
  aeris.maps.gmaps.route.RouteRenderer.prototype.renderWaypoint = function(waypoint, route) {
    var pathView, iconView;
    var self = this;

    // No Route/Waypoint provided
    if (!(waypoint instanceof Waypoint) || !(route instanceof Route)) {
      throw new InvalidArgumentError('Unable to renderWaypoint: invalid waypoint and/or route specified');
    }

    // Route doesn't own waypoint
    if (!route.has(waypoint)) {
      throw new InvalidArgumentError('Attempted to render a waypoint to a route which does not own the waypoint');
    }


    // Waypoint has already been rendered
    // --> Remove before redrawing
    if (this.routeViews_[route.cid] && this.routeViews_[route.cid][waypoint.cid]) {
      this.eraseWaypoint(waypoint, route);
    }

    // Draw the waypoint's path
    if (waypoint.path && waypoint.path.length) {
      pathView = this.drawPath_(
        waypoint.path,
        waypoint.followDirections ? this.pathOptions_ : this.offPathOptions_
      );

      // Quick and dirty polyline event Drag event
      // -- a hack which works by listening
      // to the Polyline's mousedown,
      // and the map's mouseup
      // Otherwise, Polyline has no native
      // event for this type of drag
      google.maps.event.addListener(pathView, 'mousedown', function(evt) {
        self.map.setOptions({ draggable: false });
        self.trigger('path:dragstart', waypoint, mapUtils.latLngToArray(evt.latLng));
        evt.stop();

        // Wait for mouseup on map
        // Because we're no longer mousing on the path
        google.maps.event.addListenerOnce(self.map, 'mouseup', function(evt) {
          self.map.setOptions({ draggable: true });
          self.trigger('path:dragend', waypoint, mapUtils.latLngToArray(evt.latLng));
          evt.stop();
        });
      });

      // Path click event
      google.maps.event.addListener(pathView, 'click', function(evt) {
        var latLon = mapUtils.latLngToArray(evt.latLng);
        self.trigger('path:click', waypoint, latLon);
      });
    }

    // Draw an icon for the Waypoint
    iconView = this.drawIcon_(
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
   * @param {polylineOptions=} opt_options Style options for the path.
   *
   * @private
   * @return {google.maps.Polyline}
   */
  aeris.maps.gmaps.route.RouteRenderer.prototype.drawPath_ = function(path, opt_options) {
    var options = opt_options || {};
    var polyline;

    // Convert path to google format
    path = mapUtils.pathToLatLng(path);

    polyline = new google.maps.Polyline({
      path: path,
      strokeColor: options.strokeColor,
      strokeOpacity: options.strokeOpacity,
      strokeWeight: options.strokeWeight
    });

    polyline.setMap(this.map);

    return polyline;
  };


  /**
   * Draw an icon on the map at the specified
   * latLon
   *
   * @param {Array} latLon
   * @param {iconOptions=} opt_options Style options for the icon.
   *
   * @private
   * @return {aeris.maps.markers.Icon}
   */
  aeris.maps.gmaps.route.RouteRenderer.prototype.drawIcon_ = function(latLon, opt_options) {
    var options = opt_options || {};
    var icon = new aeris.maps.markers.Icon(
      latLon,
      options.url,
      options.width,
      options.height,
      {
        clickable: options.clickable,
        draggable: options.draggable
      }
     );

    icon.setMap(this.aerisMap);

    return icon;
  };

  /**
   * Erases all route views from the map
   */
  aeris.maps.gmaps.route.RouteRenderer.prototype.eraseAllRoutes = function() {
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
  aeris.maps.gmaps.route.RouteRenderer.prototype.eraseRoute = function(route) {
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


  aeris.maps.gmaps.route.RouteRenderer.prototype.eraseWaypoint = function(waypoint, route) {
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
    icon.remove();

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


  return aeris.maps.gmaps.route.RouteRenderer;

});
