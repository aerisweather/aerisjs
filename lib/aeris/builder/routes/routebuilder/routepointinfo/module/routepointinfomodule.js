define([
  'aeris/util',
  'application/module/module',
  'aeris/events'
], function(_, Module, Events) {
  /**
   * @class aeris.builder.routes.routebuilder.routepointinfo.module.RoutePointInfoModule
   * @extends aeris.application.module.Module
   * @extends aeris.Events
   *
   * @param options
   * @constructor
   */
  var RoutePointInfoPanelModule = function(options) {
    this.InfoPanelController_ = options.InfoPanelController;
    this.activeInfoPanelController_ = null;
    this.eventHub_ = options.eventHub;
    this.routeBuilder_ = options.routeBuilder;

    Module.apply(this, arguments);
    Events.call(this);

    this.addInitializer(this.renderInfoPanelOnMarkerSelect_);
  };
  _.inherits(RoutePointInfoPanelModule, Module);
  _.extend(RoutePointInfoPanelModule.prototype, Events.prototype);


  RoutePointInfoPanelModule.prototype.renderInfoPanelOnMarkerSelect_ = function() {
    this.listenTo(this.routeBuilder_.getRoute(), {
      'select': function(routePoint) {
        this.renderInfoPanel_(routePoint);
      }
    });
  };


  RoutePointInfoPanelModule.prototype.renderInfoPanel_ = function(routePoint) {
    this.activeInfoPanelController_ = this.createInfoPanelForRoutePoint_(routePoint);
    this.showInfoPanel_(this.activeInfoPanelController_);
  };


  RoutePointInfoPanelModule.prototype.createInfoPanelForRoutePoint_ = function(routePoint) {
    return new this.InfoPanelController_({
      model: routePoint
    });
  };


  RoutePointInfoPanelModule.prototype.showInfoPanel_ = function(infoPanelController) {
    this.eventHub_.trigger('info:view', infoPanelController);
  };


  RoutePointInfoPanelModule.prototype.close = function() {
    this.stopListening();
  };


  return RoutePointInfoPanelModule;
});