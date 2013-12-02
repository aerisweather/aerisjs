define([
  'aeris/util',
  'application/module/module'
], function(_, Module) {
  /**
   * @class aeris.builder.routes.routebuilder.module.RouteBuilderModule
   * @extends aeris.application.module.Module
   *
   * @constructor
   *
   * @param {Backbone.View} options.routeControlsController Required.
   * @param {aeris.Events} options.eventHub Required.
  */
  var RouteBuilderModule = function(options) {
    /**
     * Application-wide event hub.
     * @type {aeris.Events}
     * @private
     */
    this.eventHub_ = options.eventHub;


    /**
     * Controls the UI controls view for the route builder.
     *
     * @type {Backbone.View}
     * @private
     */
    this.routeControlsController_ = options.routeControlsController;


    Module.apply(this, arguments);

    this.addInitializer(this.renderRouteControls_);
  };
  _.inherits(RouteBuilderModule, Module);


  /**
   * Render the route controls view.
   *
   * @private
   */
  RouteBuilderModule.prototype.renderRouteControls_ = function() {
    this.eventHub_.trigger('mapControls:ready', this.routeControlsController_, 'routeBuilder')
  };


  return RouteBuilderModule;
});
