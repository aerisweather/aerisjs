define([
  'aeris/util',
  'mapbuilder/controller/mapcontroller'
], function(_, BaseMapController) {
  /**
   * MapController for RouteAppBuilder.
   *
   * @override
   *
   * @extends aeris.builder.maps.controller.MapController
   * @class aeris.maps.builder.route.controller.MapController
   * @constructor
   */
  var MapController = function(opt_options) {
    // Call parent constructor
    BaseMapController.apply(this, arguments);


    /**
     * Events to bind to the RouteRenderer
     * @type {Object}
     * @private
     */
    this.rendererEvents_ = {
      'waypoint:dragend': this.moveWaypoint,
      'waypoint:click': function(waypoint) {
        var isSelected = waypoint.isSelected();

        this.route_.deselectAll();
        if (!isSelected) { waypoint.select(); }
      },
      'path:click': function(waypoint, latLon) {
        var index = this.route_.indexOf(waypoint);
        this.builder_.addWaypoint(latLon, { at: index });
      },
      'path:dragstart': function() {
        // Turn off map events,
        // As a hack around double-click event bug
        this.off(this.mapEvents_, this);
      },
      'path:dragend': function(waypoint, latLon) {
        var index = this.route_.indexOf(waypoint);
        var self = this;
        this.builder_.addWaypoint(latLon, { at: index });

        // Hack to handle
        // click event firing both on the map
        // and on the path
        window.setTimeout(function() {
          self.on(self.mapEvents_, self);
        }, 100);
      }
    };


    /**
     * Events to bind to the map
     * @type {Object}
     * @private
     */
    this.mapEvents_ = {
      'click': 'addWaypoint'
    };


    // Set up event bindings
    this.on(this.mapEvents_, this);
  };

  _.inherits(MapController, BaseMapController);


  /**
   * Set the RouteBuilder to
   * associate with this map.
   *
   * @param {aeris.maps.gmaps.route.RouteBuilder} builder
   */
  MapController.prototype.setRouteBuilder = function(builder) {
    if (this.renderer_) {
      this.stopListening(this.renderer_);
    }

    this.builder_ = builder;
    this.renderer_ = builder.getRenderer();
    this.route_ = builder.getRoute();

    // Bind renderer events
    this.listenTo(this.renderer_, this.rendererEvents_, this);

    // Bind route events
    this.listenTo(this.route_, this.routeEvents_, this);
  };

  MapController.prototype.addWaypoint = function(latLon) {
    this.builder_.addWaypoint(latLon);
  };

  MapController.prototype.moveWaypoint = function(waypoint, latLon) {
    this.builder_.moveWaypoint(waypoint, latLon);
  };


  return MapController;
});

