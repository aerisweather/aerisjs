define([
  'aeris/util',
  'vendor/backbone',
  'vendor/jquery',
  'vendor/marionette/application'
], function(_, Backbone, $, BaseApplication) {
  /**
   * Handles initialization of the map application.
   * Starts up child modules.
   *
   * @class aeris.builder.maps.MapApp
   * @extends Marionette.Application
   *
   * @constructor
   */
  var MapApp = function(options) {

    /**
     * Application layout
     *
     * @type {Marionette.Layout}
     * @private
     */
    this.layout_ = options.layout;


    /**
     * Child modules.
     *
     * @type {Array.<string,Marionette.Application|Marionette.Module>}
     * @private
     */
    this.modules_ = options.modules;


    /**
     * Application router
     *
     * @type {aeris.builder.maps.core.router.StateRouter}
     * @private
     */
    this.router_ = options.router;


    /**
     * Home, home on the DOM.
     *
     * @type {jQuery}
     */
    this.$el;

    BaseApplication.call(this, options);

    this.addInitializer(this.render);
    this.addInitializer(this.startChildModules_);

    // Start history
    this.addInitializer(function() {
      Backbone.history.start();

      // Update route to match current state
      this.router_.updateRoute();
    });
  };
  _.inherits(MapApp, BaseApplication);


  /**
   * Our application is actually a hybrid App/Layout,
   * in that is both:
   *
   * 1. Handles app initialization (Marionette.Application)
   * 2. Renders an layout, and manages regions (Marionette.Layout).
   *
   * Regions are passed on to child modules, who can
   * render their own stuff and things inside them.
   *
   * @param {aeris.builder.maps.options.MapAppOptions} config
   */
  MapApp.prototype.render = function(options) {
    // Define the base map element
    // from our builder options
    this.$el = options.get('$el') || $(options.get('el'));

    // Render our  layout in the DOM
    this.$el.empty().append(this.layout_.$el);
  };


  /**
   * Start-up child modules.
   *
   * This method expects regions to be initialized,
   * so make sure it is called after render.
   *
   * @param {Object} config
   * @private
   */
  MapApp.prototype.startChildModules_ = function(builderOptions) {
    _.each(this.modules_, function(module) {
      module.start(builderOptions);
    }, this);
  };


  return MapApp;
});
