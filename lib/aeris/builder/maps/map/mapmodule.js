define([
  'aeris/util',
  'vendor/marionette/application'
], function(_, BaseApplication) {
  /**
   * Encapsulates all MapAppBuilder controllers
   * which interact directly with the map.
   *
   * @class aeris.builder.maps.map.MapModule
   * @extends Marionette.Application
   *
   * @param {Object} options
   * @param {Marionette.Region} options.region
   *        The region within which the
   *        maps module views should live.
   * @param {jQuery} options.$el
   * @constructor
   */
  var MapModule = function(options) {
    /**
     * The region within which the
     * maps module views should live.
     *
     * @type {Marionette.Region}
     * @private
     */
    this.region_ = options.layout[options.regionName];


    /**
     * @type {aeris.builder.maps.map.controller.MapController}
     * @private
     */
    this.mapController_ = options.mapController;


    BaseApplication.call(this);

    this.addInitializer(this.render);
  };
  _.inherits(MapModule, BaseApplication);


  /**
   * Renders all views associated with this module
   */
  MapModule.prototype.render = function(builderOptions) {
    this.region_.show(this.mapController_);
  };

  return MapModule;
});
