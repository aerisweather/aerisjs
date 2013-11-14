define([
  'aeris/util',
  'application/module/module'
], function(_, Module) {
  /**
   * @class aeris.builder.maps.geosearch.module.GeosearchModule
   * @extends aeris.application.Module
   *
   * @constructor
   * @override
   *
   * @param options.eventHub Required.
   * @param options.geolocateController Required.
  */
  var GeosearchModule = function(options) {

    /**
     * Application event hub.
     *
     * @type {aeris.Events}
     * @private
     */
    this.eventHub_ = options.eventHub;


    /**
     * Geolocation controls controller
     *
     * @type {Backbone.View}
     * @private
     */
    this.geolocateController_ = options.geolocateController;


    Module.apply(this, arguments);

    this.addInitializer(this.renderControllers_);
  };
  _.inherits(GeosearchModule, Module);


  /**
   * Render controllers belonging to this
   * module.
   *
   * @private
   */
  GeosearchModule.prototype.renderControllers_ = function() {
    this.geolocateController_.render();
    this.eventHub_.trigger('mapControls:render', this.geolocateController_, 'geolocation');
  };


  return GeosearchModule;
});
