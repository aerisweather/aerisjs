define([
  'aeris/util',
  'aeris/controller',
  'gmaps/map',
  'base/events/click'
], function(_, Controller, Map, ClickEvent) {
  /**
   * MapController for RouteAppBuilder.
   * Controlls map view.
   *
   * @override
   *
   * @class
   * @constructor
   */
  var MapController = function(opt_options) {
    var options = _.extend({}, opt_options);

    this.className = 'aeris-map-canvas';


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


    /**
     * @type {aeris.events.Click}}
     * @private
     */
    this.clickEvent_ = new ClickEvent();


    // Call parent constructor
    Controller.apply(this, arguments);

    /**
     * @type {aeris.Map}
     * @private
     */
      // Create map
    this.map_ = new Map(this.el, {
      zoom: options.zoom,
      center: options.center,
      baseLayer: new options.baseLayer(),
      scrollwheel: options.scrollZoom
    });


    // Set up event bindings
    this.on(this.mapEvents_, this);
    this.proxyClickEvent_();
  };

  _.inherits(MapController, Controller);

  MapController.prototype.undelegateEvents = function() {
    Controller.prototype.undelegateEvents.apply(this, arguments);

    this.stopListening();
    this.off();
  };

  /**
   * @return {aeris.maps.Map}
   */
  MapController.prototype.getMap = function() {
    return this.map_;
  };

  /**
   * Simplify the click event
   * so the MapController fires it
   * directly.
   */
  MapController.prototype.proxyClickEvent_ = function() {
    this.clickEvent_.setMap(this.map_);
    this.clickEvent_.on('click', function(latLon) {
      this.trigger('click', latLon);
    }, this);
  };


  /**
   * Set the RouteBuilder to
   * associate with this map.
   *
   * @param builder
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
