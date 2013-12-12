define([
  'aeris/util',
  'aeris/config',
  'aeris/events',
  'gmaps/route/errors/waypointnotinrouteerror'
], function(_, config, Events, WaypointNotInRouteError) {
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
   * @typedef {Object} waypointOptions
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
   * @param {waypointOptions=} opt_options.waypoint
   *                          Options for a rending a waypoint's icon.
   *
   * @param {waypointOptions=} opt_options.selectedWaypoint
   *                          Options for rendering a selected waypoint's icon.
   *                          Defaults to the same as a non-selected waypoint,
   *                          but with a different different color icon.
   *
   *
   * @param {aeris.maps.Map} opt_options.map
   *
   * @mixes {aeris.Events}
   */
  var RouteRenderer = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      map: null
    });

    var styleOptions = this.getNormalizedStyleOptions_(options);


    /**
     * @type {polylineOptions}
     * @protected
     */
    this.pathStyles_ = styleOptions.path;


    /**
     * @type {polylineOptions}
     * @protected
     */
    this.offPathStyles_ = styleOptions.offPath;


    /**
     * @type {waypointOptions}
     * @protected
     */
    this.waypointStyles_ = styleOptions.waypoint;


    /**
     * @type {waypointOptions}
     * @protected
     */
    this.selectedWaypointStyles_ = styleOptions.selectedWaypoint;


    /**
     * @type {Array.<aeris.maps.gmaps.route.Waypoint>}
     * @private
     */
    this.renderedWaypoints_ = [];


    /**
     * The map on which to render the route.
     *
     * @type {?aeris.maps.Map}
     * @private
     */
    this.map_;


    Events.call(this);

    this.setMap(options.map);


    /**
     * @event marker:click
     * @param {Array.<number>} latLon
     * @param {aeris.maps.gmaps.route.Waypoint} waypoint
     */
    /**
     * @event marker:dragend
     * @param {Array.<number>} latLon
     * @param {aeris.maps.gmaps.route.Waypoint} waypoint
     */
    /**
     * @event path:click
     * @param {Array.<number>} latLon
     * @param {aeris.maps.gmaps.route.Waypoint} waypoint
     *        The waypoint to which the path belongs
     *        (at the end of the path).
     */
  };
  _.extend(RouteRenderer.prototype, Events.prototype);


  RouteRenderer.prototype.getNormalizedStyleOptions_ = function(options) {
    var defaultStyles = this.getDefaultStyleOptions_();
    var optionsCopy = _.clone(options);

    // Make sure all option properties are defined.
    _.defaults(optionsCopy, {
      waypoint: {},
      selectedWaypoint: {},
      path: {},
      offPath: {}
    });

    _.defaults(
      optionsCopy.waypoint,
      defaultStyles.waypoint
    );

    _.defaults(
      optionsCopy.selectedWaypoint,
      optionsCopy.waypoint,
      defaultStyles.selectedWaypoint
    );

    _.defaults(
      optionsCopy.path,
      defaultStyles.path
    );

    _.defaults(
      optionsCopy.offPath,
      optionsCopy.path,
      defaultStyles.offPath
    );

    return optionsCopy;
  };


  RouteRenderer.prototype.getDefaultStyleOptions_ = function() {
    var defaults = {
      waypoint: {
        url: config.get('path') + 'assets/marker_grey.png',
        clickable: true,
        draggable: true
      },
      selectedWaypoint: {
        url: config.get('path') + 'assets/marker_yellow.png'
      },
      path: {
        strokeColor: '#36648b',
        strokeOpacity: 0.8,
        strokeWeight: 3
      },
      offPath: {
        strokeColor: '#d00'
      }
    };

    _.defaults(defaults.selectedWaypoint, defaults.waypoint);
    _.defaults(defaults.offPath, defaults.path);

    return _.clone(defaults);
  };


  /**
   * Sets the map on which to render routes,
   * and renders all existing routes on the map.
   *
   * @param {aeris.maps.Map} map
   */
  RouteRenderer.prototype.setMap = function(map) {
    this.map_ = map;

    this.eachWaypoint_(function(waypoint) {
      waypoint.setMap(this.map_);
    });
  };


  RouteRenderer.prototype.hasMap = function() {
    return !!this.map_;
  };


  /**
   * Render all waypoints in a route.
   *
   * @param {aeris.maps.gmaps.route.Route} route
   */
  RouteRenderer.prototype.renderRoute = function(route) {
    route.each(function(waypoint) {
      this.renderWaypoint(waypoint);
    }, this);
  };


  /**
   * Render a new Waypoint on the map.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint The Waypoint to be rendered.
   */
  RouteRenderer.prototype.renderWaypoint = function(waypoint) {
    this.drawWaypoint_(waypoint);

    if (!this.isRememberedWaypoint_(waypoint)) {
      this.delegateEventsForWaypoint_(waypoint);
      this.rememberWaypoint_(waypoint);
    }
  };


  RouteRenderer.prototype.drawWaypoint_ = function(waypoint) {
    this.setStylesForWaypoint_(waypoint);

    waypoint.setMap(this.map_);
  };


  RouteRenderer.prototype.setStylesForWaypoint_ = function(waypoint) {
    var waypointStyles = waypoint.isSelected() ?
      this.selectedWaypointStyles_ : this.waypointStyles_;

    var pathStyles = waypoint.get('followDirections') ?
      this.pathStyles_ : this.offPathStyles_;

    waypoint.set(waypointStyles, { validate: true });
    waypoint.stylePath(pathStyles);
  };


  RouteRenderer.prototype.delegateEventsForWaypoint_ = function(waypoint) {
    this.proxyWaypointEvents_(waypoint);
    this.bindStylesToWaypointState_(waypoint);
  };


  RouteRenderer.prototype.bindStylesToWaypointState_ = function(waypoint) {
    this.listenTo(waypoint, {
      'change:selected change:followDirections': function() {
        this.setStylesForWaypoint_(waypoint);
      }
    });
  };


  RouteRenderer.prototype.proxyWaypointEvents_ = function(waypoint) {
    this.listenTo(waypoint, {
      'click': function(latLon) {
        this.trigger('marker:click', latLon, waypoint);
      },
      'dragend': function(latLon) {
        this.trigger('marker:dragend', latLon, waypoint);
      },
      'path:click': function(latLon) {
        this.trigger('path:click', latLon, waypoint)
      }
    });
  };


  RouteRenderer.prototype.rememberWaypoint_ = function(waypoint) {
    this.renderedWaypoints_.push(waypoint);
  };


  RouteRenderer.prototype.forgetWaypoint_ = function(waypoint) {
    this.renderedWaypoints_ = _.without(this.renderedWaypoints_, waypoint);
  };


  RouteRenderer.prototype.isRememberedWaypoint_ = function(waypoint) {
    return _.contains(this.renderedWaypoints_, waypoint);
  };


  /**
   * Erases a single route from the map
   *
   * @param {aeris.maps.gmaps.route.Route|number} route Route or Route's cid.
   */
  RouteRenderer.prototype.eraseRoute = function(route) {
    route.each(function(waypoint) {
      this.eraseWaypoint(waypoint);
    }, this);
  };


  RouteRenderer.prototype.eraseWaypoint = function(waypoint) {
    waypoint.setMap(null);
    this.stopListening(waypoint);
    this.forgetWaypoint_(waypoint);
  };


  RouteRenderer.prototype.destroy = function() {
    this.eachWaypoint_(this.eraseWaypoint);
  };


  /**
   * Iterate through waypoints in
   * this.routeViews_.
   *
   * @param {Function} callback
   *        Called with the rendered waypoint.
   *
   */
  RouteRenderer.prototype.eachWaypoint_ = function(callback) {
    _.each(this.renderedWaypoints_, function(waypoint) {
      callback.call(this, waypoint);
    }, this)
  };


  return _.expose(RouteRenderer, 'aeris.maps.gmaps.route.RouteRenderer');
});
