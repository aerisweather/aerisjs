define([
  'aeris',
  'aeris/promise',
  'gmaps/route/commands/addwaypointcommand',
  'gmaps/route/waypoint',
  'gmaps/route/route',
  'mocks/promise',
  'mocks/directionsresults',
  'testUtils',
  'gmaps/utils',
  'vendor/underscore',
  'testErrors/untestedspecerror',
  'aeris/errors/invalidargumenterror',
  'sinon'
], function(
  aeris,
  Promise,
  AddWaypointCommand,
  Waypoint,
  Route,
  StubbedPromise,
  MockDirectionsResults,
  testUtils,
  mapUtils,
  _,
  UntestedSpecError,
  InvalidArgumentError,
  sinon
) {
  describe('An AddWaypointCommand', function() {

    /**
     * Create a stubbed instance of a {aeris.maps.gmaps.route.Waypoint}.
     *
     * @return {aeris.maps.gmaps.route.Waypoint}
     */
    function getStubbedWaypoint(opt_options) {
      var waypoint = sinon.createStubInstance(Waypoint);
      var pathData;
      var options = _.extend({
        followDirections: true
      }, opt_options);

      waypoint.followDirections = options.followDirections;

      // Mock the fetchPathTo promise
      // to return empty an promise
      // This can be overwritten to provide fake data by calling
      //    args.newWaypoint.fetchPathTo.andCallFake(function() {
      //      return new StubbedPromise({
      //        resolve: true,
      //        args: [{ path: somePath, distance: 12345}]
      //      });
      //    });

      // But it will keep tests that don't deal with this command
      // from breaking.
      pathData = {
        path: [],
        distance: null
      };
      spyOn(waypoint, 'fetchPathTo').andReturn(new StubbedPromise({
        resolve: true,
        args: [pathData]
      }));

      return waypoint;
    }

    function getStubbedRoute() {
      return sinon.createStubInstance(Route);
    }


    /**
     * Get command mock objects and spies
     * needed for testing the AddWaypointCommand.
     * Cuts down on the amount of boilerplate code
     * needed for each tests
     *
     * @param {Object=} opt_options
     * @param {number=} opt_options.at Index of mocked nextWaypoint.
     * @param {Boolean=} opt_options.isFirst Is the new waypoint the first in route?
     * @param {Boolean=} opt_options.isLast Is the new waypoint the last in route?
     * @param {Boolean=} opt_options.followDirections
     *
     *
     * @return {{
     *  route: aeris.maps.gmaps.route.Route,
     *  newWaypoint: aeris.maps.gmaps.route.Waypoint,
     *  nextWaypoint: aeris.maps.gmaps.route.Waypoint,
     *  command: gmaps.route.commands.AddWaypointCommand
     * }}
     */
    function getTestObjects(opt_options) {
      var options = _.extend({
        followDirections: true,
        isFirst: opt_options && opt_options.at === 0,
        isLast: false
      }, opt_options);
      var route = getStubbedRoute();
      var newWaypoint = getStubbedWaypoint({
                          followDirections: options.followDirections
                        });
      var nextWaypoint = options.isLast ?
                          undefined :
                          getStubbedWaypoint({
                            followDirections: options.followDirections
                          });
      var prevWaypoint = options.isFirst ?
                          undefined :
                          getStubbedWaypoint();
      var command;

      // Stub route to pass 'has waypoint' test
      // For next / prev waypoints
      spyOn(route, 'has').andCallFake(function(waypoint) {
        if (_.isUndefined(waypoint)) {
          return false;
        }

        return waypoint === nextWaypoint ||
          waypoint === prevWaypoint;
      });

      // Stub route.getWaypoints to return prev/next waypoints
      spyOn(route, 'getWaypoints').andCallFake(function() {
        var waypoints = [];
        if (prevWaypoint) { waypoints.push(prevWaypoint); }
        if (nextWaypoint) { waypoints.push(nextWaypoint); }

        return waypoints;
      });

      // Stub route to return next / prev waypoints
      spyOn(route, 'at').andCallFake(function(index) {
        if (index === options.at) {
          return nextWaypoint;
        }
        else if (index === (options.at - 1)) {
          return prevWaypoint;
        }
        else {
          return undefined;
        }
      });

      command = new AddWaypointCommand(route, newWaypoint, { at: options.at });

      return {
        route: route,
        newWaypoint: newWaypoint,
        nextWaypoint: nextWaypoint,
        prevWaypoint: prevWaypoint,
        command: command
      };
    }

    it('should complete execution', function() {
      var args = getTestObjects();
      args.command.execute().done(testUtils.setFlag);

      waitsFor(testUtils.checkFlag, 'command to complete execution', 25);
    });

    describe('Adding a waypoint', function() {

      it('should add the waypoint at the correct index', function() {
        var nextIndex = 3;
        var args = getTestObjects({ at: nextIndex });

        spyOn(args.route, 'add');

        // Execute command
        args.command.execute();

        // Check that waypoint is added
        // at the index of the next waypoint
        expect(args.route.add).toHaveBeenCalledWith(args.newWaypoint, { at: nextIndex });
      });

      describe('before the first waypoint in a route', function() {
        it('should add a waypoint with no path or distance', function() {
          var args = getTestObjects({ at: 0 });

          args.command.execute().done(testUtils.setFlag);

          waitsFor(testUtils.checkFlag, 'command to execute', 25);
          runs(function() {
            expect(args.newWaypoint.path).toBeFalsy();
            expect(args.newWaypoint.distance).toBeFalsy();
            expect(testUtils.getSpies()).toHaveAllBeenCalled();
          });
        });
      });

      describe('should update the path and distance next waypoint', function() {

        it('when the next waypoint is following directions', function() {
          var directions = {
            path: testUtils.getRandomPath(),
            distance: 54321
          };
          directions.geocodedLatLon = directions.path[directions.path.length - 1];

          var args = getTestObjects({ at: 0 });

          // Create stub methods,
          // and add them to our list of "must be called" spies
          testUtils.addSpies(
            // Mock directions response
            args.newWaypoint.fetchPathTo.andCallFake(function(waypoint) {
              expect(waypoint).toEqual(args.nextWaypoint);

              return new StubbedPromise({
                resolve: true,
                args: [directions]
              });
            }),

            // Test: nextWaypoint is updated with path data
            spyOn(args.nextWaypoint, 'set').andCallFake(function(attrs) {
              expect(attrs).toEqual(directions);
            })
          );


          // Execute the command, already
          args.command.execute().done(testUtils.setFlag);

          waitsFor(testUtils.checkFlag, 'command to execute', 25);
          runs(function() {
            expect(testUtils.getSpies()).toHaveAllBeenCalled();
          });
        });

        it('when the next waypoint is not following directions', function() {
          var args = getTestObjects({
            at: 0,
            followDirections: false
          });
          var resPath = testUtils.getRandomPath(2);
          var distance = 12345;

          // Mock straight-line path getters
          testUtils.addSpies(
            spyOn(args.newWaypoint, 'getDirectPathTo').andCallFake(function(waypoint) {
              expect(waypoint).toEqual(args.nextWaypoint);
              return resPath;
            }),

            spyOn(args.newWaypoint, 'calculateDirectDistanceTo').andCallFake(function(waypoint) {
              expect(waypoint).toEqual(args.nextWaypoint);
              return distance;
            }),

            // Test: nextWaypoint is updated with path data
            spyOn(args.nextWaypoint, 'set').andCallFake(function(attrs) {
              expect(attrs).toEqual({
                path: resPath,
                distance: distance
              });
            })
          );

          // Run, Forest, run
          args.command.execute().done(testUtils.setFlag);

          waitsFor(testUtils.checkFlag, 'command to execute', 25);
          runs(function() {
            expect(testUtils.getSpies()).toHaveAllBeenCalled();
          });
        });
      });

      describe('should create a path and distance to the previous waypoint', function() {
        it('when the new waypoint is following directions', function() {
          var atIndex = 2;
          var path = testUtils.getRandomPath();
          var directions = {
            path: path,
            distance: 12345
          };
          var args = getTestObjects({ at: atIndex });

          testUtils.addSpies(
            // Provide path data
            args.prevWaypoint.fetchPathTo.andCallFake(function(waypoint) {
              expect(waypoint).toEqual(args.newWaypoint);

              return new StubbedPromise({
                resolve: true,
                args: [directions]
              });
            }),

            // Test: path data is set on newWaypoint
            spyOn(args.newWaypoint, 'set')
          );

          args.command.execute().done(testUtils.setFlag);

          waitsFor(testUtils.checkFlag, 'command to execute', 25);
          runs(function() {
            expect(testUtils.getSpies()).toHaveAllBeenCalled();
            expect(args.newWaypoint.set).toHaveBeenCalledWith(_.extend(directions, {
              geocodedLatLon: directions.path[directions.path.length - 1]
            }));
          });
        });

        it('when the new waypoint is not following directions', function() {
          var atIndex = 2;
          var args = getTestObjects({
            at: atIndex,
            followDirections: false
          });
          var directions = {
            path: testUtils.getRandomPath(2),
            distance: 12345
          };

          testUtils.addSpies(
            // Provide direct path
            spyOn(args.prevWaypoint, 'getDirectPathTo').andCallFake(function(waypoint) {
              expect(waypoint).toEqual(args.newWaypoint);
              return directions.path;
            }),

            // Provide directions
            spyOn(args.prevWaypoint, 'calculateDirectDistanceTo').andCallFake(function(waypoint) {
              expect(waypoint).toEqual(args.newWaypoint);
              return directions.distance;
            }),

            // Test: set directions attribute on newWaypoint
            spyOn(args.newWaypoint, 'set').andCallFake(function(attrs) {
              expect(attrs).toEqual(directions);
            })
          );

          args.command.execute().done(testUtils.setFlag);

          waitsFor(testUtils.checkFlag, 'command to execute', 25);
          runs(function() {
            expect(testUtils.getSpies()).toHaveAllBeenCalled();
          });
        });
      });


      describe('at the end of the route', function() {
        it('should not run into any unexpected issues', function() {
          // All the logic's been tested
          // We'll just make sure we're not throwing any errors
          var args = getTestObjects({
            at: 3,
            isLast: true
          });

          args.command.execute();
        });
      });
    });
  });
});

