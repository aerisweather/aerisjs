define([
  'aeris/util',
  'aeris/config',
  'aeris/events'
], function(_, config, Events) {
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
   * @namespace aeris.maps.gmaps.route
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
   * @uses {aeris.Events}
   */
  var RouteRenderer = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      map: null
    });


    /**
     * @type {polylineOptions}
     * @protected
     * @property pathStyles_
     */
    this.pathStyles_ = {};


    /**
     * @type {polylineOptions}
     * @protected
     * @property offPathStyles_
     */
    this.offPathStyles_ = {};


    /**
     * @type {waypointOptions}
     * @protected
     * @property waypointStyles_
     */
    this.waypointStyles_ = {};


    /**
     * @type {waypointOptions}
     * @protected
     * @property selectedWaypointStyles_
     */
    this.selectedWaypointStyles_ = {};


    /**
     * @type {Array.<aeris.maps.gmaps.route.Waypoint>}
     * @private
     * @property renderedWaypoints_
     */
    this.renderedWaypoints_ = [];


    /**
     * The map on which to render the route.
     *
     * @type {?aeris.maps.Map}
     * @private
     * @property map_
     */
    this.map_;


    Events.call(this);

    this.setStyles(options);

    this.setMap(options.map);


    /**
     * @event marker:click
     * @param {aeris.maps.LatLon} latLon
     * @param {aeris.maps.gmaps.route.Waypoint} waypoint
     */
    /**
     * @event marker:dragend
     * @param {aeris.maps.LatLon} latLon
     * @param {aeris.maps.gmaps.route.Waypoint} waypoint
     */
    /**
     * @event path:click
     * @param {aeris.maps.LatLon} latLon
     * @param {aeris.maps.gmaps.route.Waypoint} waypoint
     *        The waypoint to which the path belongs
     *        (at the end of the path).
     */
  };
  _.extend(RouteRenderer.prototype, Events.prototype);


  RouteRenderer.prototype.setStyles = function(styles) {
    var defaultStyles = this.getDefaultStyleOptions_();
    styles = this.getNormalizedStyleOptions_(styles);

    this.waypointStyles_ = _.defaults({}, styles.waypoint, this.waypointStyles_, defaultStyles.waypoint);
    this.selectedWaypointStyles_ = _.defaults({}, styles.selectedWaypoint, this.selectedWaypointStyles_, defaultStyles.selectedWaypoint);
    this.pathStyles_ = _.defaults({}, styles.path, this.pathStyles_, defaultStyles.path);
    this.offPathStyles_ = _.defaults({}, styles.offPath, this.offPathStyles_, defaultStyles.offPath);

    this.eachWaypoint_(this.setStylesForWaypoint_);
  };


  /**
   * @param {Object} options
   * @return {Object}
   * @private
   * @method getNormalizedStyleOptions_
   */
  RouteRenderer.prototype.getNormalizedStyleOptions_ = function(options) {
    var optionsCopy = _.clone(options);

    // Make sure all option properties are defined.
    return _.defaults(optionsCopy, {
      waypoint: {},
      selectedWaypoint: {},
      path: {},
      offPath: {}
    });
  };


  /**
   * @return {Object}
   * @private
   * @method getDefaultStyleOptions_
   */
  RouteRenderer.prototype.getDefaultStyleOptions_ = function() {
    var defaults = {
      waypoint: {
        url: config.get('assetPath') + 'marker_grey.png',
        clickable: true,
        draggable: true,
        offsetX: 0,
        offsetY: 0
      },
      selectedWaypoint: {
        url: config.get('assetPath') + 'marker_yellow.png'
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
   * @method setMap
   */
  RouteRenderer.prototype.setMap = function(map) {
    this.map_ = map;

    this.eachWaypoint_(function(waypoint) {
      waypoint.setMap(this.map_);
    });
  };


  /**
   * @return {Boolean}
   * @method hasMap
   */
  RouteRenderer.prototype.hasMap = function() {
    return !!this.map_;
  };


  /**
   * Render all waypoints in a route.
   *
   * @param {aeris.maps.gmaps.route.Route} route
   * @method renderRoute
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
   * @method renderWaypoint
   */
  RouteRenderer.prototype.renderWaypoint = function(waypoint) {
    this.drawWaypoint_(waypoint);

    if (!this.isRememberedWaypoint_(waypoint)) {
      this.delegateEventsForWaypoint_(waypoint);
      this.rememberWaypoint_(waypoint);
    }
  };


  /**
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @private
   * @method drawWaypoint_
   */
  RouteRenderer.prototype.drawWaypoint_ = function(waypoint) {
    this.setStylesForWaypoint_(waypoint);

    waypoint.setMap(this.map_);
  };


  /**
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @private
   * @method setStylesForWaypoint_
   */
  RouteRenderer.prototype.setStylesForWaypoint_ = function(waypoint) {
    var waypointStyles = _.extend({}, this.waypointStyles_, {
      selectedUrl: this.selectedWaypointStyles_.url,
      selectedOffsetX: this.selectedWaypointStyles_.offsetX,
      selectedOffsetY: this.selectedWaypointStyles_.offsetY,
      clickable: waypoint.isSelected() ? this.selectedWaypointStyles_.clickable : this.waypointStyles_.clickable,
      draggable: waypoint.isSelected() ? this.selectedWaypointStyles_.draggable : this.waypointStyles_.draggable
    });

    var pathStyles = waypoint.get('followDirections') ?
      this.pathStyles_ : this.offPathStyles_;

    waypoint.set(waypointStyles, { validate: true });
    waypoint.stylePath(pathStyles);
  };


  /**
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @private
   * @method delegateEventsForWaypoint_
   */
  RouteRenderer.prototype.delegateEventsForWaypoint_ = function(waypoint) {
    this.proxyWaypointEvents_(waypoint);
    this.bindStylesToWaypointState_(waypoint);
  };


  /**
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @private
   * @method bindStylesToWaypointState_
   */
  RouteRenderer.prototype.bindStylesToWaypointState_ = function(waypoint) {
    this.listenTo(waypoint, {
      'change:selected change:followDirections': function() {
        this.setStylesForWaypoint_(waypoint);
      }
    });
  };


  /**
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @private
   * @method proxyWaypointEvents_
   */
  RouteRenderer.prototype.proxyWaypointEvents_ = function(waypoint) {
    this.listenTo(waypoint, {
      'click': function(latLon) {
        this.trigger('marker:click', latLon, waypoint);
      },
      'dragend': function(latLon) {
        this.trigger('marker:dragend', latLon, waypoint);
      },
      'path:click': function(latLon) {
        this.trigger('path:click', latLon, waypoint);
      }
    });
  };


  /**
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @private
   * @method rememberWaypoint_
   */
  RouteRenderer.prototype.rememberWaypoint_ = function(waypoint) {
    this.renderedWaypoints_.push(waypoint);
  };


  /**
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @private
   * @method forgetWaypoint_
   */
  RouteRenderer.prototype.forgetWaypoint_ = function(waypoint) {
    this.renderedWaypoints_ = _.without(this.renderedWaypoints_, waypoint);
  };


  /**
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {Boolean}
   * @private
   * @method isRememberedWaypoint_
   */
  RouteRenderer.prototype.isRememberedWaypoint_ = function(waypoint) {
    return _.contains(this.renderedWaypoints_, waypoint);
  };


  /**
   * Erases a single route from the map
   *
   * @param {aeris.maps.gmaps.route.Route|number} route Route or Route's cid.
   * @method eraseRoute
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


  /**
   * Close and clean up the RouteRenderer instance.
   * @method destroy
   */
  RouteRenderer.prototype.destroy = function() {
    this.eachWaypoint_(this.eraseWaypoint);
  };


  /**
   * Iterate through waypoints in
   * this.routeViews_.
   *
   * @param {Function} callback
   *        Called with the rendered waypoint.
   * @method eachWaypoint_
   */
  RouteRenderer.prototype.eachWaypoint_ = function(callback) {
    _.each(this.renderedWaypoints_, function(waypoint) {
      callback.call(this, waypoint);
    }, this);
  };


  return _.expose(RouteRenderer, 'aeris.maps.gmaps.route.RouteRenderer');
});
