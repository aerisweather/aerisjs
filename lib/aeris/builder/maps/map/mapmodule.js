define([
  'aeris/util',
  'mapbuilder/core/module/statemodule'
], function(_, StateModule) {
  /**
   * Encapsulates all MapAppBuilder controllers
   * which interact directly with the map.
   *
   * @class aeris.builder.maps.map.MapModule
   * @extends aeris.builder.maps.core.module.StateModule
   *
   * @constructor
   * @override
   *
   * @param {Object} options
   * @param {aeris.builder.maps.map.controller.MapController} options.mapController
   */
  var MapModule = function(options) {
    /**
     * @type {aeris.builder.maps.map.controller.MapController}
     * @private
     */
    this.mapController_ = options.mapController;


    StateModule.call(this, options);
  };
  _.inherits(MapModule, StateModule);


  /**
   * Renders all views associated with this module
   *
   * @override
   */
  MapModule.prototype.render = function(builderOptions) {
    this.region_.show(this.mapController_);
  };

  return MapModule;
});
