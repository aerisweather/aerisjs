define([
  'aeris/util',
  'mapbuilder/core/module/statemodule'
], function(_, StateModule) {
  /**
   * Encapsulates all MapAppBuilder controllers
   * which interact directly with the map.
   *
   * @class aeris.builder.maps.map.module.MapModule
   * @extends aeris.builder.maps.core.module.StateModule
   *
   * @constructor
   * @override
   *
   * @param {Object} options
   * @param {aeris.builder.maps.map.controller.MapController} options.mapController Required.
   * @param {Marionette.Region} options.mapCanvasRegion Required.
   */
  var MapModule = function(options) {
    /**
     * @type {aeris.builder.maps.map.controller.MapController}
     * @private
     */
    this.mapController_ = options.mapController;


    /**
     * Region in which to render the map view.
     *
     * @type {Marionette.Region}
     * @private
     */
    this.mapCanvasRegion_ = options.mapCanvasRegion;


    StateModule.call(this, options);

    this.addInitializer(this.renderMap);
  };
  _.inherits(MapModule, StateModule);


  /**
   * Renders all views associated with this module
   *
   * @override
   */
  MapModule.prototype.renderMap = function(builderOptions) {
    this.mapCanvasRegion_.show(this.mapController_);
  };

  return MapModule;
});
