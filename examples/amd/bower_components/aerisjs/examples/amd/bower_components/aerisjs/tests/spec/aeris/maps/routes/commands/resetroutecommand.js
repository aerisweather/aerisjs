define([
  'jasmine',
  'testUtils',
  'aeris/maps/routes/commands/resetroutecommand',
  'aeris/maps/routes/route',
  'aeris/maps/routes/waypoint'
], function(
  jasmine,
  testUtils,
  ResetRouteCommand,
  Route,
  Waypoint
) {

  function getStubbedWaypoints() {
    return [
      sinon.createStubInstance(Waypoint),
      sinon.createStubInstance(Waypoint),
      sinon.createStubInstance(Waypoint)
    ];
  }

  function getStubbedRoute() {
    var route = sinon.createStubInstance(Route);
    route.reset = jasmine.createSpy('reset');
    return route;
  }

  var TestFactory = function() {
    this.oldWaypoints_ = getStubbedWaypoints();
    this.newWaypoints_ = getStubbedWaypoints();
    this.route_ = getStubbedRoute();

    this.getRoute().getWaypoints = jasmine.createSpy('getWaypoints').
      andReturn(this.getOldWaypoints());

    this.command_ = new ResetRouteCommand(this.getRoute(), this.getNewWaypoints());
  };
  TestFactory.prototype = {
    getRoute: function() { return this.route_; },
    getOldWaypoints: function() { return this.oldWaypoints_; },
    getNewWaypoints: function() { return this.newWaypoints_; },
    getCommand: function() { return this.command_; }
  };

  describe('A ResetRouteCommand', function() {
    it('should reset a route with new waypoints', function() {
      var f = new TestFactory();

      f.getCommand().execute();
      expect(f.getRoute().reset).toHaveBeenCalledWith(f.getNewWaypoints());
    });

    it('should undo', function() {
      var f = new TestFactory();

      f.getCommand().execute();
      f.getCommand().undo();
      expect(f.getRoute().reset).toHaveBeenCalledWith(f.getOldWaypoints());
    });
  });
});
