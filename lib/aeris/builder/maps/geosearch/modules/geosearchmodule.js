define([
  'aeris/util',
  'aeris/application/modules/module'
], function(_, Module) {
  /**
   * @class GeosearchModule
   * @namespace aeris.builder.maps.geosearch.modules
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
     * @property eventHub_
     */
    this.eventHub_ = options.eventHub;


    /**
     * Geolocation controls controller.
     *
     * @type {Backbone.View}
     * @private
     * @property geolocateController_
     */
    this.geolocateController_ = options.geolocateController;


    /**
     * Geocode search controls controller.
     *
     * @type {Backbone.View}
     * @private
     * @property geocodeController_
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
   * @method renderControllers_
   */
  GeosearchModule.prototype.renderControllers_ = function() {
    this.eventHub_.trigger('mapControls:ready', this.geolocateController_, 'geolocation');
    this.eventHub_.trigger('mapControls:ready', this.geocodeController_, 'geocode');
  };


  return GeosearchModule;
});
