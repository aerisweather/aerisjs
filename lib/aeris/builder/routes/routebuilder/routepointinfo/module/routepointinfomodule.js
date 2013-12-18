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
    this.InfoPanelViewModel_ = options.InfoPanelViewModel;
    this.infoPanelController_ = options.infoPanelController;
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
      },
      'deselect': function(routePoint) {
        this.closeInfoPanel_();
      }
    });
  };


  RoutePointInfoPanelModule.prototype.renderInfoPanel_ = function(routePoint) {
    this.setInfoPanelData_(routePoint);
    this.showInfoPanel_();
  };

  RoutePointInfoPanelModule.prototype.closeInfoPanel_ = function() {
    this.infoPanelController_.close();
  };


  RoutePointInfoPanelModule.prototype.setInfoPanelData_ = function(routePoint) {
    var infoPanelViewModel = this.createInfoPanelViewModel_(routePoint);

    this.infoPanelController_.resetData(infoPanelViewModel.toJSON());
  };


  RoutePointInfoPanelModule.prototype.createInfoPanelViewModel_ = function(routePoint) {
    return new this.InfoPanelViewModel_(null, {
      data: routePoint
    });
  };


  RoutePointInfoPanelModule.prototype.showInfoPanel_ = function() {
    this.eventHub_.trigger('info:view', this.infoPanelController_);

    // InfoPanelController is getting hidden
    // if trying to show muliple times,
    // though not sure why.
    this.infoPanelController_.$el.show();
  };


  RoutePointInfoPanelModule.prototype.close = function() {
    this.stopListening();
  };


  return RoutePointInfoPanelModule;
});