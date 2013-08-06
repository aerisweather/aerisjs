define([
  'aeris',
  'testUtils',
  'gmaps/utils',
  'gmaps/route/commands/resetroutecommand',
  'gmaps/route/commands/addwaypointcommand',
  'aeris/promise',
  'gmaps/route/route',
  'mocks/waypoint',
  'googlemaps'
], function(
  aeris,
  testUtils,
  gUtils,
  ResetRouteCommand,
  AddWaypointCommand,
  Promise,
  Route,
  MockWaypoint
) {
  describe('A ResetRouteCommand', function() {


    it('should return a promise on execute', function() {
      var command = new ResetRouteCommand(new Route());
      expect(command.execute()).toBeInstanceOf(Promise);
    });

    it('should clear a route', function() {
      var route = new Route(testUtils.getMockWaypoints());
      var command = new ResetRouteCommand(route);

      command.execute().done(testUtils.setFlag);
      waitsFor(testUtils.checkFlag, 'to execute command', 1000);

      runs(function() {
        expect(route.getWaypoints().length).toEqual(0);
      });
    });

    it('should reset a route with the provided waypoints', function() {
      var newWaypoints = testUtils.getMockWaypoints();
      var route = new Route(testUtils.getMockWaypoints());
      var command = new ResetRouteCommand(route, newWaypoints);

      command.execute().done(testUtils.setFlag);
      waitsFor(testUtils.checkFlag, 'to execute command', 1000);

      runs(function() {
        expect(route).toMatchRoute(new Route(newWaypoints));
      });
    });

    it('should recalculate a route', function() {
      var dumbWaypoints = [
        new MockWaypoint({ distance: 0 }, true),
        new MockWaypoint({ distance: 0 }, true),
        new MockWaypoint({ distance: 0 }, true)
      ];
      var route = new Route(testUtils.getMockWaypoints());
      var command = new ResetRouteCommand(route, dumbWaypoints, true);

      spyOn(route, 'add');
      spyOn(AddWaypointCommand.prototype, 'execute').andReturn((function() {
        var promise = new Promise();
        promise.resolve();
        return promise;
      }()));

      command.execute().done(testUtils.setFlag);
      waitsFor(testUtils.checkFlag, 'to execute command', 1000);

      runs(function() {
        expect(AddWaypointCommand.prototype.execute.callCount).toEqual(3);
      });
    });
    
    it('should undo', function() {
      var route = new Route(testUtils.getMockWaypoints());
      var route_orig = testUtils.cloneRoute(route);
      var command = new ResetRouteCommand(route, testUtils.getMockWaypoints());

      command.execute().done(function() {
        command.undo().done(function() {
          expect(route).toMatchRoute(route_orig);
          testUtils.setFlag();
        });
      });

      waitsFor(testUtils.checkFlag, 'undo to complete', 50);
    });
  });
});
