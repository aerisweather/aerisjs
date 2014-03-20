define([
  'aeris/util',
  'aeris/events'
], function(_, Events) {
  /**
   * @class RouteBuilderController
   * @namespace aeris.builder.routes.routebuilder.controllers
   * @implements aeris.application.controllers.ControllerInterface
   *
   * @param {Object} options
   * @param {aeris.maps.gmaps.route.RouteBuilder} options.routeBuilder
   * @param {Function} options.RoutePoint Constructor for {aeris.maps.routes.Waypoint} to use.
   *                                      when creating new points in a route.
   * @param {aeris.Events} options.eventHub
   *
   * @constructor
   */
  var RouteBuilderController = function(options) {
    this.routeBuilder_ = options.routeBuilder;
    this.isRendered_ = false;
    this.RoutePoint_ = options.RoutePoint;
    this.map_ = null;

    /**
     * @property eventHub_
     * @private
     * @type {aeris.Events}
    */
    this.eventHub_ = options.eventHub;

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

    this.bindMapInteractions_();

    this.isRendered_ = true;
  };


  RouteBuilderController.prototype.styleRoute = function(styles) {
    this.routeBuilder_.styleRoute(styles);
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


  RouteBuilderController.prototype.bindMapInteractions_ = function() {
    this.listenTo(this.routeBuilder_, {
      'path:click': this.addRoutePointBefore_,
      'waypoint:click': this.triggerClickEvent_,
      'waypoint:dragend': this.moveRoutePoint_
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


  /**
   * @method triggerClickEvent_
   * @private
   */
  RouteBuilderController.prototype.triggerClickEvent_ = function(latLon, routepoint) {
    this.eventHub_.trigger('routepoint:click', latLon, routepoint);
  };


  return RouteBuilderController;
});
/**
 * @for aeris.builder.maps.event.EventHub
 */
/**
 * @event routepoint:click
 * @param {aeris.maps.LatLon} latLon
 * @param {aeris.maps.routes.Waypoint} routepoint
*/
