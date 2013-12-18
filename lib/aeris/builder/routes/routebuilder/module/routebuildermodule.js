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
   * @param {aeris.Model} options.appState Required.
   * @param {aeris.application.controller.ControllerInterface} options.routeBuilderController
  */
  var RouteBuilderModule = function(options) {
    /**
     * Application-wide event hub.
     * @type {aeris.Events}
     * @private
     */
    this.eventHub_ = options.eventHub;


    /**
     * @type {aeris.Model}
     * @private
     */
    this.appState_ = options.appState;

    /**
     * Controls the UI controls view for the route builder.
     *
     * @type {aeris.application.controller.ControllerInterface}
     * @private
     */
    this.routeControlsController_ = options.routeControlsController;


    /**
     * @type {aeris.application.controller.ControllerInterface}
     * @private
     */
    this.routeBuilderController_ = options.routeBuilderController;


    Module.apply(this, arguments);

    this.addInitializer(this.bindRouteBuilderToMap_);
    this.addInitializer(this.startupRouteBuilder_);
    this.addInitializer(this.renderRouteControls_);
  };
  _.inherits(RouteBuilderModule, Module);


  RouteBuilderModule.prototype.bindRouteBuilderToMap_ = function() {
    this.listenTo(this.appState_, {
      'change:map': function() {
        this.routeBuilderController_.setMap(this.appState_.get('map'));
      }
    });
  };


  RouteBuilderModule.prototype.startupRouteBuilder_ = function() {
    if (this.appState_.hasMap()) {
      this.routeBuilderController_.setMap(this.appState_.get('map'));
    }

    this.routeBuilderController_.render();
  };


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
