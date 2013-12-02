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
   * @param {aeris.Events} options.eventHub Required.
   * @param {Backbone.View} options.geolocateController Required.
   * @param {Backbone.View} options.geocodeController Required.
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
     * Geolocation controls controller.
     *
     * @type {Backbone.View}
     * @private
     */
    this.geolocateController_ = options.geolocateController;


    /**
     * Geocode search controls controller.
     *
     * @type {Backbone.View}
     * @private
     */
    this.geocodeController_ = options.geocodeController;


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
    this.eventHub_.trigger('mapControls:ready', this.geolocateController_, 'geolocation');
    this.eventHub_.trigger('mapControls:ready', this.geocodeController_, 'geocode');
  };


  return GeosearchModule;
});
