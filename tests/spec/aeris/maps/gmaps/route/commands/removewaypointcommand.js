define([
  'aeris',
  'aeris/promise',
  'testUtils',
  'gmaps/utils',
  'gmaps/route/commands/removewaypointcommand',
  'mocks/waypoint',
  'gmaps/route/route',
  'mocks/directionsresults',
  'testErrors/untestedspecerror',
  'aeris/errors/invalidargumenterror',
  'vendor/underscore'
], function(
  aeris,
  Promise,
  testUtils,
  gUtils,
  RemoveWaypointCommand,
  MockWaypoint,
  Route,
  MockDirectionsResult,
  UntestedSpecError,
  InvalidArgumentError,
  _
) {
  describe('A RemoveWaypointCommand', function() {
    var waypoints, route;
    var firstWaypoint, middleWaypoint, lastWaypoint;

    beforeEach(function() {
      waypoints = [
        new MockWaypoint(null, true),
        new MockWaypoint(),
        new MockWaypoint()
      ];
      firstWaypoint = waypoints[0];
      middleWaypoint = waypoints[1];
      lastWaypoint = waypoints[2];

      waypoints_orig = waypoints.slice(0);


      route = new Route(waypoints);

      directionsResult = new MockDirectionsResult();
      spyOn(google.maps.DirectionsService.prototype, 'route').andCallFake(function(request, callback) {
        callback(directionsResult, google.maps.DirectionsStatus.OK);
      });
    });

    afterEach(function() {
      waypoints = [];
      waypoints.length = 0;

      route = null;

      testUtils.resetFlag();
    });

    it('should require a route and a waypoint', function() {
      expect(function() {
        new RemoveWaypointCommand();
      }).toThrowType('InvalidArgumentError');

      new RemoveWaypointCommand(route, firstWaypoint);
    });

    it('should return a promise', function() {
      var waypoint = new MockWaypoint();
      var command = new RemoveWaypointCommand(new Route([waypoint]), waypoint);
      expect(command.execute()).toBeInstanceOf(Promise);
    });

    it('should resolve its promise after fetching API data', function() {
      var waypoints = [
        new MockWaypoint(null, true),
        new MockWaypoint(),
        new MockWaypoint
      ];
      var command = new RemoveWaypointCommand(new Route(waypoints), waypoints[0]);
      var flag = false;

      // Service is mocked to immediately call callback
      command.execute().done(function() {
        flag = true;
      });
      expect(flag).toEqual(true);
    });

    it('should remove a waypoint from a route', function() {
      var command1 = new RemoveWaypointCommand(route, firstWaypoint);
      var command2 = new RemoveWaypointCommand(route, middleWaypoint);
      var command3 = new RemoveWaypointCommand(route, lastWaypoint);
      var flag = false;

      spyOn(route, 'remove');

      waitsFor(function() {
        return flag === true;
      }, 'command promises to resolve', 2000);

      Promise.when(command1.execute(), command2.execute(), command3.execute()).done(function() {
        flag = true;
        expect(route.remove.argsForCall).toEqual([
          [firstWaypoint],
          [middleWaypoint],
          [lastWaypoint]
        ]);
      });
    });

    describe('for a waypoint following a path', function() {
      describe('for the first waypoint in a route', function() {
        var command;

        beforeEach(function() {
          command = new RemoveWaypointCommand(route, firstWaypoint);
        });

        afterEach(function() {
          command = null;
        });

        it('should remove the following waypoint\'s path', function() {
          command.execute();
          expect(middleWaypoint.path).toBeNull();
        });

        it('should set the following waypoint\'s \'previous\' property to null', function() {
          command.execute();
          expect(middleWaypoint.previous).toBeNull();
        });

        it('should set the following waypoint\'s \'distance\' property to 0', function() {
          command.execute();
          expect(middleWaypoint.distance).toEqual(0);
        });

        it('should NOT query the Google Directions service', function() {
          command.execute();
          expect(google.maps.DirectionsService.prototype.route).not.toHaveBeenCalled();
        });

        it('should not affect other waypoints', function() {
          expect(lastWaypoint).toEqual(waypoints_orig[2]);
        });
      });

      describe('for a waypoint in the middle of a route', function() {
        var command;

        beforeEach(function() {
          command = new RemoveWaypointCommand(route, middleWaypoint);
        });

        afterEach(function() {
          command = null;
        });


        it('should set the following path\'s \'previous\' property to the previous waypoint', function() {
          command.execute();
          expect(lastWaypoint.previous).toMatchWaypoint(firstWaypoint);
          expect(lastWaypoint.previous.cid).toEqual(firstWaypoint.cid);
        });

        it('should query the Google Directions service for directions between the previous and following waypoints', function() {
          var reqObj;

          command.execute();

          // Test: called directions service
          expect(google.maps.DirectionsService.prototype.route.callCount).toEqual(1);


          // Test: requested path between first and last waypoints
          reqObj = google.maps.DirectionsService.prototype.route.argsForCall[0][0];
          expect(reqObj.origin).toBeNearLatLng(firstWaypoint.getLatLon());
          expect(reqObj.destination).toBeNearLatLng(lastWaypoint.getLatLon());

        });

        it('should replace the following waypoint\'s path with a new path from Google Directions', function() {
          var responsePath = directionsResult.routes[0].overview_path;

          command.execute();

          // Check that paths from results were set on the following waypoint
          _.each(responsePath, function(googleLatLng, i) {
            var wpLatLng = lastWaypoint.path[i];
            expect(wpLatLng).toBeNearLatLng(googleLatLng);
          });

          expect(lastWaypoint.path.length).toEqual(responsePath.length);
        });

        it('should update the following waypoint\'s distance, with data from Google Directions', function() {
          var responseDistance = directionsResult.routes[0].legs[0].distance.value;
          command.execute();

          expect(lastWaypoint.distance).toEqual(responseDistance);
        });

        it('should handle errors from Google Directions service', function() {
          google.maps.DirectionsService.prototype.route.andCallFake(function(request, callback) {
            callback(directionsResult, google.maps.DirectionsStatus.INVALID_REQUEST);
          });

          command.execute().fail(testUtils.setFlag);

          waitsFor(testUtils.checkFlag, 'execute promise to fail', 500);
        });

        it('should not affect the previous waypoint', function() {
          expect(firstWaypoint).toEqual(waypoints_orig[0]);
        });
      });

      describe('for a waypoint at the end of a route', function() {
        it('should not effect any other waypoints', function() {
          expect(firstWaypoint).toEqual(waypoints_orig[0]);
          expect(middleWaypoint).toEqual(waypoints_orig[1]);
        });
      });
    });

    describe('for a waypoint not following a path', function() {
      beforeEach(function() {
        waypoints = [
          new MockWaypoint(null, true),
          new MockWaypoint({ followPaths: false }),
          new MockWaypoint()
        ];
        firstWaypoint = waypoints[0];
        middleWaypoint = waypoints[1];
        lastWaypoint = waypoints[2];

        route = new Route(waypoints);

        // Removes middle waypoint
        command = new RemoveWaypointCommand(route, middleWaypoint);
      });

      it('should set the following waypoint\'s path as a direct line to the previous waypoint', function() {
        command.execute();

        expect(lastWaypoint.path).toEqual([
          firstWaypoint.getLatLon(),
          lastWaypoint.getLatLon()
        ]);
      });

      it('should set the following waypoint\'s \'followPaths\' property to false', function() {
        command.execute();

        expect(lastWaypoint.followPaths).toEqual(false);
      });

      it('should request distance data from the google.geometry library', function() {
        spyOn(google.maps.geometry.spherical, 'computeDistanceBetween').andReturn(54321);
        command.execute();

        expect(google.maps.geometry.spherical.computeDistanceBetween).toHaveBeenCalledWith(
          gUtils.arrayToLatLng(firstWaypoint.getLatLon()),
          gUtils.arrayToLatLng(lastWaypoint.getLatLon())
        );
      });

      it('should set the following waypoint\'s distance with data from the Google geometry library', function() {
        spyOn(google.maps.geometry.spherical, 'computeDistanceBetween').andReturn(54321);
        command.execute();

        expect(lastWaypoint.distance).toEqual(54321);
      });
    });
  });
});
