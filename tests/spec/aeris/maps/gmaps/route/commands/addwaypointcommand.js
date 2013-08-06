define([
  'aeris',
  'testErrors/untestedspecerror',
  'testUtils',
  'aeris/promise',
  'mocks/waypoint',
  'gmaps/route/route',
  'gmaps/route/commands/addwaypointcommand',
  'mocks/directionsresults'
], function(aeris, UntestedSpecError, testUtils, Promise, MockWaypoint, Route, AddWaypointCommand, MockDirectionsResult) {
  describe('An AddWaypointCommand', function() {
    var directionsResult;

    beforeEach(function() {
      directionsResult = new MockDirectionsResult();
      spyOn(google.maps.DirectionsService.prototype, 'route').andCallFake(function(request, callback) {
        callback(directionsResult, google.maps.DirectionsStatus.OK);
      });
    });


    it('adds a waypoint to a route', function() {
      var route = new Route();
      var waypoint = new MockWaypoint();
      var command;

      spyOn(route, 'add');

      command = new AddWaypointCommand(route, waypoint);
      command.execute();

      expect(route.add).toHaveBeenCalledWith(waypoint);
    });

    it('should return a promise', function() {
      var command = new AddWaypointCommand(new Route(), new MockWaypoint());
      expect(command.execute()).toBeInstanceOf(Promise);
    });

    it('should resolve its promise after fetching API data', function() {
      var command = new AddWaypointCommand(new Route(), new MockWaypoint());

      // Service is mocked to immediately call callback
      command.execute().done(testUtils.setFlag);
      expect(testUtils.checkFlag()).toEqual(true);
    });

    describe('Not following paths', function() {
      it('should set the path property as a direct line to the previous waypoint', function() {
        var firstWaypoint = new MockWaypoint(null, true);
        var secondWaypoint = new MockWaypoint({
          followDirections: false
        }, true);
        var route = new Route([firstWaypoint]);
        var command = new AddWaypointCommand(route, secondWaypoint);

        command.execute().done(function() {
          expect(route.getLastWaypoint().path).toEqual([
            firstWaypoint.getLatLon(),
            secondWaypoint.getLatLon()
          ]);
          testUtils.setFlag();
        });

        waitsFor(testUtils.checkFlag, 'command to execute', 50);
      });
    });

    describe('Undo', function() {

      it('should return a promise', function() {
        var route = new Route();
        var command = new AddWaypointCommand(route, new MockWaypoint());
        command.execute().done(testUtils.setFlag);

        waitsFor(testUtils.checkFlag, 'to execute command', 500);
        runs(function() {
          expect(command.undo()).toBeInstanceOf(Promise);
        });
      });

      it('should fail if command hasn\'t been executed', function() {
        var command = new AddWaypointCommand(new Route(), new MockWaypoint());

        expect(function() {
          command.undo();
        }).toThrowType('CommandHistoryError');
      });

      it('should revert state', function() {
        var route = new Route(testUtils.getMockWaypoints());
        var route_orig = testUtils.cloneRoute(route);
        var newWaypoint = new MockWaypoint();
        var command = new AddWaypointCommand(route, newWaypoint);

        command.execute().done(function() {
          command.undo().done(testUtils.setFlag);
        });

        waitsFor(testUtils.checkFlag, 'to undo command', 500);
        runs(function() {
          expect(route.getWaypoints().length).toEqual(3);
          expect(route).toMatchRoute(route_orig);
        });
      });
    });
  });
});
