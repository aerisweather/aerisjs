define([
  'aeris/util',
  'aeris/events'
], function(_, Events) {
  /**
   * @class aeris.builder.routes.routebuilder.controller.RouteBuilderController
   * @implements aeris.application.controller.ControllerInterface
   *
   * @param options
   * @param {aeris.maps.gmaps.route.RouteBuilder} options.routeBuilder
   *
   * @constructor
   */
  var RouteBuilderController = function(options) {
    this.routeBuilder_ = options.routeBuilder;
    this.isRendered_ = false;
    this.RoutePoint_ = options.RoutePoint;
    this.map_ = null;

    Events.call(this);
  };
  _.extend(RouteBuilderController.prototype, Events.prototype);


  RouteBuilderController.prototype.setMap = function(map) {
    this.destroyMapBindings_();

    this.map_ = map;
    this.routeBuilder_.setMap(this.map_);

    if (!_.isNull(map) && this.isRendered_) {
      this.setupMapBindings_();
    }
  };


  RouteBuilderController.prototype.render = function() {
    if (this.map_) {
      this.setupMapBindings_();
    }

    this.setupRoutePointBindings_();
    this.setupRouteBindings_();

    this.isRendered_ = true;
  };


  RouteBuilderController.prototype.setupMapBindings_ = function() {
    this.listenTo(this.map_, {
      'click': this.addRoutePoint_
    });
  };


  RouteBuilderController.prototype.destroyMapBindings_ = function() {
    if (this.map_) {
      this.stopListening(this.map_);
    }
  };


  RouteBuilderController.prototype.setupRoutePointBindings_ = function() {
    this.listenTo(this.routeBuilder_, {
      'path:click': this.addRoutePointBefore_,
      'waypoint:click': function(latLon, routePoint) {
        routePoint.toggleSelect();
      },
      'waypoint:dragend': this.moveRoutePoint_
    })
  };


  RouteBuilderController.prototype.setupRouteBindings_ = function() {
    this.listenTo(this.routeBuilder_.getRoute(), {
      'select': this.selectOnly_
    });
  };


  RouteBuilderController.prototype.addRoutePoint_ = function(latLon) {
    var routePoint = this.createRoutePoint_(latLon);
    this.routeBuilder_.addWaypoint(routePoint);
  };


  RouteBuilderController.prototype.addRoutePointBefore_ = function(latLon, beforeRoutePoint) {
    var routePoint = this.createRoutePoint_(latLon);
    var atIndex = this.routeBuilder_.getRoute().indexOf(beforeRoutePoint);

    this.routeBuilder_.addWaypointAt(routePoint, atIndex);
  };


  RouteBuilderController.prototype.moveRoutePoint_ = function(latLon, routePoint) {
    this.routeBuilder_.moveWaypoint(routePoint, latLon);
  };


  RouteBuilderController.prototype.createRoutePoint_ = function(latLon) {
    return new this.RoutePoint_({
      position: latLon
    });
  };


  RouteBuilderController.prototype.selectOnly_ = function(routePoint) {
    var route = this.routeBuilder_.getRoute();
    routePoint.select();
    route.deselectAllExcept(routePoint);
  };


  return RouteBuilderController;
});
