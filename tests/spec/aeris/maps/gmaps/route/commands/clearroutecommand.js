define([
  'aeris',
  'testUtils',
  'gmaps/route/commands/clearroutecommand',
  'aeris/promise',
  'gmaps/route/route',
  'mocks/waypoint'
], function(aeris, testUtils, ClearRouteCommand, Promise, Route, MockWaypoint) {
  describe('A ClearRouteCommand', function() {
    var waypoints;

    beforeEach(function() {
      testUtils.resetFlag();

      waypoints = [
        new MockWaypoint(null, true),
        new MockWaypoint(),
        new MockWaypoint()
      ];
    });


    afterEach(function() {
      waypoints = [];
      waypoints.length = 0;
    });

    it('should return a promise on execute', function() {
      var command = new ClearRouteCommand(new Route());
      expect(command.execute()).toBeInstanceOf(Promise);
    });

    it('should remove all waypoints from a route', function() {
      var route = new Route(waypoints);
      var command = new ClearRouteCommand(route);

      command.execute().done(testUtils.setFlag);

      waitsFor(testUtils.checkFlag, 'command to execute', 1000);

      runs(function() {
        expect(route.getWaypoints().length).toEqual(0);
      });
    });
  });
});
