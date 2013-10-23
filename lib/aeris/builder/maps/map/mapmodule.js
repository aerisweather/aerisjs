define([
  'aeris/util',
  'mapbuilder/core/module/module'
], function(_, BaseModule) {
  /**
   * Encapsulates all MapAppBuilder controllers
   * which interact directly with the map.
   *
   * @class aeris.builder.maps.map.MapModule
   * @extends aeris.builder.maps.core.module.Module
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


    BaseModule.call(this, options);
  };
  _.inherits(MapModule, BaseModule);


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
