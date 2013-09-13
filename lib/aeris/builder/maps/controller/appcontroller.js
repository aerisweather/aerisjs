// This will be overwritten by MapAppBuilder
//define('mapAppLayerCollection');
define([
  'aeris/util',
  'aeris/events',
  'aeris/controller',
  'aeris/builder/maps/controller/mapcontroller',
  'aeris/builder/maps/controller/layercontrolscontroller'
], function(
  _,
  Events,
  BaseController,
  MapController,
  LayerControlsController
) {

  /**
   * @class aeris.builder.maps.controller.AppController
   * @constructor
   * @extends aeris.Controller
   *
   * @param {Object} options
   * @param {aeris.maps.AbstractMap} options.map
   * @param {Array.<aeris.maps.Layer>} options.layers Layer constuctors.
   * @param {Object} options.controls see {aeris.builder.maps.options.MapAppBuilderOptions}.
   */
  var AppController = function(options) {
    BaseController.apply(this, arguments);
  };
  _.inherits(AppController, BaseController);


  /**
   * @override
   */
  AppController.prototype.className = 'aeris-maps-app aeris-route-app';


  AppController.prototype.initialize = function() {
    var layers = [];

    this.mapController_ = new MapController(this.options.map);

    // Create layer instance
    // and add to mapt
    _.each(this.options.layers, function(layerOpt) {
      var layer = new layerOpt.type();
      layers.push(layer);

      // Add to layer, if set to { default: true }
      if (layerOpt.default) {
        this.mapController_.addLayer(layer);
      }
    }, this);

    // Create layer controls
    this.layerControlsController_ = new LayerControlsController({
      layers: layers
    });
  };


  AppController.prototype.delegateEvents = function() {
    BaseController.prototype.delegateEvents.apply(this, arguments);

    // Global events
    this.listenTo(Events.hub, {
      'layer:select': _.bind(this.mapController_.addLayer, this.mapController_),
      'layer:deselect': _.bind(this.mapController_.removeLayer, this.mapController_)
    });
  };


  AppController.prototype.undelegateEvents = function() {
    BaseController.prototype.undelegateEvents.apply(this, arguments);
    this.stopListening();
  };


  /**
   * @override
   */
  AppController.prototype.render = function() {
    this.$el.
      empty().
      append(this.mapController_.render().$el);

    if (this.options.controls.layers) {
      this.$el.append(this.layerControlsController_.render().$el);
    }

    this.bindUIElements();
    this.delegateEvents();

    return this;
  };


  /**
   * @override
   */
  AppController.prototype.close = function() {
    this.$el.empty().remove();
    this.mapController_.close();

    this.undelegateEvents();
  };


  return AppController;
});
