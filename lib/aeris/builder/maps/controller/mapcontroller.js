define([
  'aeris/util',
  'aeris/events',
  'aeris/controller',
  'gmaps/map',
  'base/events/click',
  'base/layers/googleroadmap'
], function(_, Events, Controller, Map, ClickEvent, GoogleRoadMap) {
  /**
   * MapController for AppBuilder.
   * Controls map view.
   *
   * @override
   *
   * @param {Object=} opt_options
   * @param {Array.<number>=} opt_options.center Lat Lon coordination on which to center map.
   * @param {Object=} opt_options.baseLayer Class Contstructor for the maps base layer.
   * @param {number=} opt_options.zoom
   * @param {Boolean=} opt_options.scrollZoom Whether to use the mouse scrollwheel to zoom on the map.
   *
   * @extends aeris.Controller
   * @class aeris.builder.maps.controller.MapController
   * @constructor
   */
  var MapController = function(opt_options) {
    this.options_ = _.extend({
      center: [44.98, -93.2636],
      zoom: 4,
      baseLayer: GoogleRoadMap
    }, opt_options);



    // Call parent constructor
    Controller.apply(this, arguments);


    /**
     * @type {aeris.events.Click}
     * @private
     */
    this.clickEvent_ = new ClickEvent();


    /**
     * @type {aeris.maps.Layer}
     * @protected
     */
    this.layers_ = [];


    /**
     * @type {aeris.Map}
     * @private
     */
      // Create map
    this.map_ = new Map(this.el, {
      zoom: this.options_.zoom,
      center: this.options_.center,
      baseLayer: new this.options_.baseLayer(),
      scrollwheel: this.options_.scrollZoom
    });


    this.proxyClickEvent_();
  };

  _.inherits(MapController, Controller);


  /**
   * @override
   */
  MapController.prototype.className = 'aeris-map-canvas';


  /**
   * @override
   */
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
   * Add a layer to a map
   *
   * @param {aeris.maps.Layer} layer
   */
  MapController.prototype.addLayer = function(layer) {
    // Check if layer is already added
    if (this.layers_.indexOf(layer) !== -1) {
      return;
    }

    layer.setMap(this.getMap());
    this.layers_.push(layer);
    this.trigger('layer:add', layer);
  };

  /**
   * Remove a layer from a map
   *
   * @param {aeris.maps.Layer} layer
   */
  MapController.prototype.removeLayer = function(layer) {
    var layerIndex = this.layers_.indexOf(layer);

    // Check if layer exists
    if (layerIndex === -1) {
      return;
    }

    layer.remove();
    this.layers_.splice(layerIndex, 1);
    Events.publish('layer:remove', layer);
  };


  return MapController;
});