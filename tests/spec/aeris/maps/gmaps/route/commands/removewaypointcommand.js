define([
  'aeris',
  'vendor/underscore',
  'aeris/promise',
  'testUtils',
  'gmaps/utils',
  'gmaps/route/commands/removewaypointcommand',
  'mocks/waypoint',
  'gmaps/route/route',
  'mocks/directionsresults',
  'testErrors/untestedspecerror',
  'aeris/errors/invalidargumenterror'
], function(
  aeris,
  _,
  Promise,
  testUtils,
  gUtils,
  RemoveWaypointCommand,
  MockWaypoint,
  Route,
  MockDirectionsResult,
  UntestedSpecError,
  InvalidArgumentError
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

      spyOn(route, 'remove');

      Promise.when(command1.execute(), command2.execute(), command3.execute()).done(function() {
        expect(route.remove.argsForCall).toEqual([
          [firstWaypoint],
          [middleWaypoint],
          [lastWaypoint]
        ]);
        testUtils.setFlag();
      });

      waitsFor(testUtils.checkFlag, 'command promises to resolve', 2000);
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

        it('should set the following waypoint\'s \'distance\' property to 0', function() {
          command.execute();
          expect(middleWaypoint.getDistance()).toEqual(0);
        });

        it('should NOT query the Google Directions service', function() {
          command.execute();
          expect(google.maps.DirectionsService.prototype.route).not.toHaveBeenCalled();
        });

        it('should not affect other waypoints', function() {
          command.execute();
          expect(lastWaypoint).toEqual(waypoints_orig[2]);
        });

        it('should undo', function() {
          var route_orig = testUtils.cloneRoute(route);

          command.execute().done(function() {
            command.undo().done(function() {
              expect(route).toMatchRoute(route_orig);
              testUtils.setFlag();
            });
          });

          waitsFor(testUtils.checkFlag, 'undo to complete', 50);
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

          expect(lastWaypoint.getDistance()).toEqual(responseDistance);
        });

        it('should handle errors from Google Directions service', function() {
          // Change route spy to return error status
          google.maps.DirectionsService.prototype.route.andCallFake(function(request, callback) {
            callback(directionsResult, google.maps.DirectionsStatus.INVALID_REQUEST);
          });

          command.execute().fail(testUtils.setFlag);

          waitsFor(testUtils.checkFlag, 'execute promise to fail', 500);
        });

        it('should not affect the previous waypoint', function() {
          expect(firstWaypoint).toEqual(waypoints_orig[0]);
        });

        it('should undo', function() {
          var route_orig = testUtils.cloneRoute(route);

          command.execute().done(function() {
            command.undo().done(function() {
              expect(route).toMatchRoute(route_orig);
              testUtils.setFlag();
            });
          });

          waitsFor(testUtils.checkFlag, 'undo to complete', 50);
        });
      });

      describe('for a waypoint at the end of a route', function() {
        var command;

        beforeEach(function() {
          command = new RemoveWaypointCommand(route, lastWaypoint);
        });

        afterEach(function() {
          command = null;
        });



        it('should not effect any other waypoints', function() {
          command.execute();

          expect(firstWaypoint).toEqual(waypoints_orig[0]);
          expect(middleWaypoint).toEqual(waypoints_orig[1]);
        });

        it('should undo', function() {
          var route_orig = testUtils.cloneRoute(route);

          command.execute().done(function() {
            command.undo().done(testUtils.setFlag);
          });

          waitsFor(testUtils.checkFlag, 'undo to complete', 50);
          runs(function() {
            expect(route).toMatchRoute(route_orig);
          });
        });
      });
    });

    describe('for a waypoint not following a path', function() {
      beforeEach(function() {
        waypoints = [
          new MockWaypoint(null, true),
          new MockWaypoint({ followDirections: false }),
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

      it('should set the following waypoint\'s \'followDirections\' property to false', function() {
        command.execute();

        expect(lastWaypoint.followDirections).toEqual(false);
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

        expect(lastWaypoint.getDistance()).toEqual(54321);
      });
    });
  });
});
