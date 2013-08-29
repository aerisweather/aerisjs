define([
  'aeris/controller',
  'aeris/util',
  'gmaps/route/route',
  'gmaps/route/routerenderer',
  'gmaps/route/routebuilder',

  'aeris/builder/route/controller/mapcontroller',
  'aeris/builder/route/controller/controlscontroller',
  'aeris/builder/route/controller/waypointinfocontroller'
], function(
  Controller,
  _,
  Route,
  RouteRenderer,
  RouteBuilder,

  MapController,
  ControlsController,
  WaypointInfoController
) {
  /**
   * @class aeris.builder.route.controller.AppController
   * @constructor
   * @extends aeris.Controller
   */
  var AppController = function() {
    this.className = 'aeris-maps-app aeris-route-app';


    /**
     * Events to bind to the Route
     * @type {Object}
     * @private
     */
    this.routeEvents_ = {
      'waypoint:select': this.openWaypointInfo,
      'waypoint:deselect': this.closeWaypointInfo,
      'change:latLon': function(waypoint) {
        if (this.waypointInfoViews_[waypoint.cid]) {
          // Re-render the info window
          this.closeWaypointInfo(waypoint);
          this.openWaypointInfo(waypoint);
        }
      }
    };


    /**
     * Open WaypointInfoController views
     * @type {WaypointInfoController}
     * @private
     */
    this.waypointInfoViews_ = {};


    /**
     * InfoBox view
     * {aeris.maps.layers.InfoBox}
     * @private
     */
    this.infoBox_ = null;

    Controller.apply(this, arguments);
  };

  _.inherits(AppController, Controller);


  AppController.prototype.initialize = function(options) {
    var mapOptions, builderOptions, controlsOptions;

    this.options_ = options;

    // Create map
    mapOptions = _.extend({}, this.options_.mapOptions);
    this.map_ = new MapController(mapOptions);


    // Create Builder
    builderOptions = {
      routeRenderer: new RouteRenderer(this.map_.getMap(), this.options_.routeOptions),
      route: new Route()
    };
    this.builder_ = new RouteBuilder(builderOptions);

    // Give builder to map
    this.map_.setRouteBuilder(this.builder_);


    // Create Controls
    if (this.options_.controlsOptions) {
      controlsOptions = _.extend(this.options_.controlsOptions, {
        builder: this.builder_
      });
      this.controls_ = new ControlsController(controlsOptions);
      this.controls_.render();
    }
  };


  AppController.prototype.delegateEvents = function() {
    Controller.prototype.delegateEvents.apply(this, arguments);

    // Bind route events
    this.listenTo(this.builder_.getRoute(), this.routeEvents_, this);
  };



  AppController.prototype.undelegateEvents = function() {
    Controller.prototype.undelegateEvents.apply(this, arguments);

    // Clean up route events
    this.stopListening(this.builder_.getRoute(), this.routeEvents_, this);
  };



  AppController.prototype.render = function() {
    this.$el.empty();

    this.$el.append(this.map_.$el);

    if (this.controls_) {
      this.$el.append(this.controls_.$el);
    }

    return this;
  };


  AppController.prototype.close = function() {
    this.$el.
      empty().
      remove();

    this.undelegateEvents();
  };


  AppController.prototype.addWaypoint = function(latLon) {
    this.builder_.addWaypoint(latLon);
  };


  /**
   * Creates and renders a WaypointInfo view
   * for a given waypoint.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   */
  AppController.prototype.openWaypointInfo = function(waypoint) {
    // If window is already open, quit.
    if (this.waypointInfoViews_[waypoint.cid]) { return; }

    var infoView = new WaypointInfoController({
      builder: this.builder_,
      waypoint: waypoint,
      map: this.map_.getMap(),
      controls: this.options_.controlsOptions
    });

    infoView.render();

    // Save, so we can get rid of it later
    this.waypointInfoViews_[waypoint.cid] = infoView;

    // Mark the waypoint as selected
    waypoint.select();

    // And remove saved controller when it closes
    this.listenToOnce(infoView, 'close', function() {
      delete this.waypointInfoViews_[waypoint.cid];
    }, this);
  };


  /**
   * Closes a WaypointInfo view
   * for a given waypoint.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   */
  AppController.prototype.closeWaypointInfo = function(waypoint) {
    var infoView = this.waypointInfoViews_[waypoint.cid];

    if (!infoView) { return; }

    infoView.close();
  };

  return AppController;
});
