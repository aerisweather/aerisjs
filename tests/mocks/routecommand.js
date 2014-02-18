define([
  'aeris/util',
  'aeris/promise',
  'aeris/maps/routes/commands/abstractroutecommand',
  'mocks/waypoint',
  'aeris/maps/routes/route'
], function(_, Promise, AbstractRouteCommand, MockWaypoint, Route) {

  /**
   *
   * @constructor
   * @extends {aeris.maps.gmaps.route.commands.AbstractRouteCommand}
   */
  var RouteCommand = function(route) {
    route || (route = new Route());

    AbstractRouteCommand.call(this, route);

    this.mockWaypoint_ = new MockWaypoint();
  };

  _.inherits(RouteCommand, AbstractRouteCommand);

  RouteCommand.prototype.execute_ = function() {
    var self = this;
    var promise = new Promise();

    window.setTimeout(function() {
      self.route_.add(self.mockWaypoint_);
      promise.resolve();
    }, 50);

    return promise;
  };

  RouteCommand.prototype.undo_ = function() {
    var self = this;
    var promise = new Promise();

    window.setTimeout(function() {
      self.route_.reset(self.previousRouteState_);
      promise.resolve();
    }, 50);

    return promise;
  };


  return RouteCommand;
});
