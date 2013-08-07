define([
  'jasmine',
  'aeris',
  'testUtils',
  'vendor/underscore',
  'gmaps/route/commands/clearroutecommand',
  'aeris/promise',
  'gmaps/route/route',
  'gmaps/route/waypoint',
  'mocks/promise'
], function(jasmine, aeris, testUtils, _, ClearRouteCommand, Promise, Route, Waypoint, StubbedPromise) {
  describe('A ClearRouteCommand', function() {
    var waypoints;

    function getStubbedWaypoints(opt_count) {
      var count = opt_count || 3;
      var waypoints = [];

      _.times(count, function() {
        waypoints.push(sinon.createStubInstance(Waypoint));
      });

      return waypoints;
    }

    function getStubbedRoute() {
      var route = sinon.createStubInstance(Route);

      route.reset = jasmine.createSpy('Route reset');
      return route;
    }

    it('should return a promise on execute', function() {
      var command = new ClearRouteCommand(getStubbedRoute());
      expect(command.execute()).toBeInstanceOf(Promise);
    });

    it('should remove all waypoints from a route', function() {
      var route = getStubbedRoute();
      var command = new ClearRouteCommand(route);

      command.execute();

      expect(route.reset).toHaveBeenCalledWith();
    });

    it('should undo', function() {
      var route = getStubbedRoute();
      var waypoints = getStubbedWaypoints();
      var command = new ClearRouteCommand(route);

      route.getWaypoints = jasmine.createSpy('getWaypoints').
        andReturn(waypoints);

      command.execute();
      command.undo();

      expect(route.reset).toHaveBeenCalledWith(waypoints);
    });
  });
});
