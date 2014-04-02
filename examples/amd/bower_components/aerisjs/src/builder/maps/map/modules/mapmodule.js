define([
  'aeris/util',
  'aeris/builder/maps/core/modules/statemodule'
], function(_, StateModule) {
  /**
   * Encapsulates all MapAppBuilder controllers
   * which interact directly with the map.
   *
   * @class MapModule
   * @namespace aeris.builder.maps.map.modules
   * @extends aeris.builder.maps.core.modules.StateModule
   *
   * @constructor
   * @override
   *
   * @param {Object} options
   * @param {aeris.builder.maps.map.controllers.MapController} options.mapController Required.
   * @param {Marionette.Region} options.mapCanvasRegion Required.
   */
  var MapModule = function(options) {
    /**
     * @type {aeris.builder.maps.map.controllers.MapController}
     * @private
     * @property mapController_
     */
    this.mapController_ = options.mapController;


    /**
     * Region in which to render the map view.
     *
     * @type {Marionette.Region}
     * @private
     * @property mapCanvasRegion_
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
   * @method renderMap
   */
  MapModule.prototype.renderMap = function(builderOptions) {
    this.mapCanvasRegion_.show(this.mapController_);
  };

  return MapModule;
});
