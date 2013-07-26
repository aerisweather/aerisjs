define([
  'aeris',
  'gmaps/route/commands/abstractroutecommand',
  'mocks/waypoint',
  'gmaps/route/route'
], function(aeris, AbstractRouteCommand, MockWaypoint, Route) {

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

  aeris.inherits(RouteCommand, AbstractRouteCommand);

  RouteCommand.prototype.execute_ = function() {
    var self = this;

    window.setTimeout(function() {
      self.route_.add(self.mockWaypoint_);
      self.executePromise_.resolve();
    }, 50);
  };

  RouteCommand.prototype.undo_ = function() {
    var self = this;

    window.setTimeout(function() {
      self.route_.reset(self.previousRouteState_);
      self.undoPromise_.resolve();
    }, 50);
  };


  return RouteCommand;
});
