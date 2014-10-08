define([
  'aeris/util',
  'aeris/maps/routes/commands/helpers/routereverser',
  'aeris/model',
  'aeris/collection',
  'aeris/maps/routes/waypoint',
  'aeris/maps/routes/route'
], function(_, RouteReverser, Model, Collection, Waypoint, Route) {
  var MockWaypoint = function(opt_attrs, opt_options) {
    var attrs = _.defaults(opt_attrs || {}, {
      position: new CannedPosition(),
      path: new CannedPath(),
      followDirections: _.uniqueId('followDirection_'),
      travelMode: _.uniqueId('travelMode_'),
      distance: _.uniqueId('distance_')
    });

    this.map_ = attrs.map || null;

    Model.call(this, attrs, opt_options);
  };
  _.inherits(MockWaypoint, Waypoint);

  MockWaypoint.prototype.validate = jasmine.createSpy('validate');

  MockWaypoint.prototype.setMap = function(map) {
    this.map_ = map;
  };

  MockWaypoint.prototype.getMap = function() {
    return this.map_;
  };


  var MockRoute = function() {
    Collection.apply(this, arguments);

    this.addStubbedMethods([
      'getNext',
      'getPrevious',
      'getWaypoints',
      'contains',
      'add',
      'remove',
      'reset',
      'set'
    ]);
  };
  _.inherits(MockRoute, Route);


  MockRoute.prototype.addStubbedMethods = function(stubbedMethods) {
    _.extend(this, jasmine.createSpyObj('mockRoute', stubbedMethods));
  };

  MockRoute.prototype.setStubbedWaypoints = function(stubbedWaypoints) {
    this.contains.andCallFake(function(waypoint) {
      return _.contains(stubbedWaypoints, waypoint);
    });

    this.getWaypoints.andReturn(stubbedWaypoints);

    this.models = stubbedWaypoints;
  };


  MockRoute.prototype.setHasPrev = function(hasPrev, opt_prevWaypoint) {
    var prevWaypoint = opt_prevWaypoint || new MockWaypoint();
    var getPrevReturnValue = hasPrev ? prevWaypoint : undefined;

    this.getPrevious.andReturn(getPrevReturnValue);
  };


  MockRoute.prototype.setHasNext = function(hasNext, opt_nextWaypoint) {
    var nextWaypoint = opt_nextWaypoint || new MockWaypoint();
    var getNextReturnValue = hasNext ? nextWaypoint : undefined;

    this.getNext.andReturn(getNextReturnValue);
  };


  var CannedPath = function() {
    this.testId = _.uniqueId('cannedPath_');
    this.reverse = jasmine.createSpy('reverse');
  };

  var CannedPosition = function() {
    this.testId = _.uniqueId('cannedPosition_');
  };





  describe('A RouteReverser', function() {

    describe('getWaypointInReverse', function() {

      it('should reject waypoints which do not belong to the route', function() {
        var route = new MockRoute();
        var reverser = new RouteReverser(route);

        route.contains.andReturn(false);

        expect(function() {
          reverser.getWaypointInReverse(new MockWaypoint());
        }).toThrowType('WaypointNotInRouteError');
      });



      describe('if the provided waypoint is the last or only waypoint', function() {
        var route, waypoint, reverser;

        beforeEach(function() {
          route = new MockRoute();
          waypoint = new MockWaypoint();
          reverser = new RouteReverser(route);

          route.setStubbedWaypoints([waypoint]);
          route.setHasNext(false);
        });

        describe('the created waypoint', function() {

          it('should have no path or distance', function() {
            var reverseWaypoint;

            waypoint.set('path', new CannedPath());
            waypoint.set('distance', 567.89);

            reverseWaypoint = reverser.getWaypointInReverse(waypoint);

            expect(reverseWaypoint.get('path')).toEqual([]);
            expect(reverseWaypoint.get('distance')).toEqual(0);
          });

          it('should have the same path-describing attributes as the original', function() {
            var reverseWaypoint;

            waypoint.set({
              followDirections: 'no -- I know a shortcut!',
              travelMode: 'JETSKI'
            });

            reverseWaypoint = reverser.getWaypointInReverse(waypoint);

            expect(reverseWaypoint.get('followDirections')).toEqual('no -- I know a shortcut!');
            expect(reverseWaypoint.get('travelMode')).toEqual('JETSKI');

          });

          it('should have the same position as the original', function() {
            var reverseWaypoint;

            waypoint.set('position', [45, -90]);

            reverseWaypoint = reverser.getWaypointInReverse(waypoint);

            expect(reverseWaypoint.get('position')).toEqual([45, -90]);
          });

          it('should not contain any references to original waypoint attributes', function() {
            var reverseWaypoint;

            waypoint.set('position', [45, -90]);

            reverseWaypoint = reverser.getWaypointInReverse(waypoint);

            reverseWaypoint.attributes.position.push('foo');

            // Reverse waypoint attribute changed
            expect(reverseWaypoint.get('position')).toEqual([45, -90, 'foo']);

            // Original waypoint attribute should not change
            expect(waypoint.get('position')).toEqual([45, -90]);
          });

        });

      });


      describe('if the provided waypoint is in the middle of a route', function() {
        var route, prevWaypoint, middleWaypoint, nextWaypoint, reverser;

        beforeEach(function() {
          route = new MockRoute();

          prevWaypoint = new MockWaypoint();
          middleWaypoint = new MockWaypoint();
          nextWaypoint = new MockWaypoint();

          reverser = new RouteReverser(route);

          spyOn(reverser, 'getWaypointPathInReverse').andReturn([]);

          route.setStubbedWaypoints([
            prevWaypoint,
            middleWaypoint,
            nextWaypoint
          ]);

          route.setHasPrev(true, prevWaypoint);
          route.setHasNext(true, nextWaypoint);
        });



        describe('the created waypoint', function() {

          it('should have a reverse version of the next waypoint\'s path', function() {
            var reverseWaypoint;

            reverser.getWaypointPathInReverse.andReturn(['pointB', 'pointA']);

            nextWaypoint.set({
              path: ['pointA', 'pointB']
            });

            reverseWaypoint = reverser.getWaypointInReverse(middleWaypoint);

            expect(reverseWaypoint.get('path')).toEqual(['pointB', 'pointA']);
          });

          it('should have the same distance as the next waypoint', function() {
            var reverseWaypoint;

            nextWaypoint.set({
              distance: 1234.56
            });

            reverseWaypoint = reverser.getWaypointInReverse(middleWaypoint);

            expect(reverseWaypoint.get('distance')).toEqual(1234.56);
          });

          it('should have the same path-describing attributes as the next waypoint in the route', function() {
            var reverseWaypoint;

            nextWaypoint.set({
              followDirections: 'will do.',
              travelMode: 'WALKING_BACKWARDS'
            });

            reverseWaypoint = reverser.getWaypointInReverse(middleWaypoint);

            expect(reverseWaypoint.get('followDirections')).toEqual('will do.');
            expect(reverseWaypoint.get('travelMode')).toEqual('WALKING_BACKWARDS');
          });

          it('should have the same position as the original waypoint', function() {
            var reverseWaypoint;

            middleWaypoint.set({
              position: [45, -90]
            });

            reverseWaypoint = reverser.getWaypointInReverse(middleWaypoint);

            expect(reverseWaypoint.get('position')).toEqual([45, -90]);
          });

          it('should not contain any references to original waypoint attributes', function() {
            var reverseWaypoint;

            middleWaypoint.set({
              position: [45, -90]
            });

            nextWaypoint.set({
              path: ['some', 'path']
            });

            reverseWaypoint = reverser.getWaypointInReverse(middleWaypoint);

            reverseWaypoint.attributes.position.push('foo');
            reverseWaypoint.attributes.path.push('foo');

            expect(middleWaypoint.get('position')).toEqual([45, -90]);
            expect(nextWaypoint.get('path')).toEqual(['some', 'path']);
          });

          it('should not be set to a map', function() {
            var reverseWaypoint = reverser.getWaypointInReverse(middleWaypoint);

            expect(reverseWaypoint.getMap()).toBeNull();
          });

        });

      });


    });


    describe('getRouteWaypointsInReverse', function() {
      var reverser;
      var route;

      beforeEach(function() {
        route = new MockRoute();
        reverser = new RouteReverser(route);
      });

      describe('For a route with no waypoints', function() {

        it('should return no waypoints', function() {
          var reverseWaypoints;

          route.setStubbedWaypoints([]);

          reverseWaypoints = reverser.getRouteWaypointsInReverse();

          expect(reverseWaypoints).toEqual([]);
        });

      });

      describe('For a route with any number of waypoints', function() {
        var waypoints;

        beforeEach(function() {
          waypoints = [
            new MockWaypoint(),
            new MockWaypoint(),
            new MockWaypoint(),
            new MockWaypoint()
          ];

          route.setStubbedWaypoints(waypoints);

          spyOn(reverser, 'getWaypointInReverse').andCallFake(function(waypoint) {
            var waypointIndex = waypoints.indexOf(waypoint);

            return 'reverse_of_waypoint_' + waypointIndex;
          });
        });

        it('should return reverse versions of waypoint, and in reverse order', function() {
          var reverseWaypoints = reverser.getRouteWaypointsInReverse();

          expect(reverseWaypoints).toEqual([
            'reverse_of_waypoint_3',
            'reverse_of_waypoint_2',
            'reverse_of_waypoint_1',
            'reverse_of_waypoint_0'
          ]);
        });

        it('should not modify the route', function() {
          var waypointsOrig = _.clone(waypoints);

          reverser.getRouteWaypointsInReverse();

          expect(waypoints).toEqual(waypointsOrig);
          expect(route.getWaypoints()).toEqual(waypointsOrig);

          expect(route.add).not.toHaveBeenCalled();
          expect(route.remove).not.toHaveBeenCalled();
          expect(route.reset).not.toHaveBeenCalled();
          expect(route.set).not.toHaveBeenCalled();
        });

      });

    });


    describe('Class integration', function() {
      var route;
      var reverser;
      var lastWaypoint;
      var middleWaypoint;
      var firstWaypoint;

      beforeEach(function() {
        firstWaypoint = new MockWaypoint({
          position: [100, 100],
          path: [],
          distance: 0,
          followDirections: 'sure',
          travelMode: 'ANY_MEANS_NECESSARY'
        });
        middleWaypoint = new MockWaypoint({
          position: [200, 200],
          // Path from first to middle
          path: [
            [100, 100],
            [150, 150],
            [200, 200]
          ],
          distance: 200.2,
          followDirections: 'nah',
          travelMode: 'THE_WORM'
        });
        lastWaypoint = new MockWaypoint({
          position: [300, 300],
          // Path from middle to last
          path: [
            [200, 200],
            [250, 250],
            [300, 300]
          ],
          distance: 300.3,
          followDirections: 'youGotta',
          travelMode: 'FASTER_THAN_YOU'
        });

        route = new MockRoute();

        route.setStubbedWaypoints([
          firstWaypoint,
          middleWaypoint,
          lastWaypoint
        ]);
        route.getPrevious.andCallFake(function(waypoint) {
          if (waypoint === firstWaypoint) { return undefined; }
          if (waypoint === middleWaypoint) { return firstWaypoint; }
          if (waypoint === lastWaypoint) { return middleWaypoint; }

          throw Error('MockMethodError: Unexpected waypoint param for route.getPrevious');
        });
        route.getNext.andCallFake(function(waypoint) {
          if (waypoint === firstWaypoint) { return middleWaypoint; }
          if (waypoint === middleWaypoint) { return lastWaypoint; }
          if (waypoint === lastWaypoint) { return undefined; }

          throw Error('MockMethodError: Unexpected waypoint param for route.getNext');
        });

        reverser = new RouteReverser(route);


        this.addMatchers({
          // Somewhat-deep equality (to one level)
          toEqualAttributes: function(expectedAttrs) {
            var shouldBeDifferentMessage;
            var shouldBeEqualMessage;
            var actualAttrs = this.actual;
            var isSameLength = (_.keys(expectedAttrs).length === _.keys(actualAttrs).length);
            var differentAttrs = [];



            _.each(actualAttrs, function(actualValue, key) {
              var expectedValue = expectedAttrs[key];

              if (!_.isEqual(actualValue, expectedValue)) {
                differentAttrs.push(key);
              }
            }, this);


            shouldBeEqualMessage = function() {
              if (!isSameLength) {
                return 'Attributes do not have the same keys. Actual keys: ' +
                  _.keys(actualAttrs).join(', ') + '. Expected keys: ' +
                  _.keys(expectedAttrs).join(', ') + '.';
              }
              else {
                return 'Expected attribute(s) ' + differentAttrs.join(', ') + ' to be the same. ' +
                  'Actual attributes ' + jasmine.pp(actualAttrs) + ' Expected attributes: ' +
                  jasmine.pp(expectedAttrs);
              }
            };

            shouldBeDifferentMessage = function() {
              return 'Expected attribute(s) to be different, but they were the same. Actual: ' +
                jasmine.pp(actualAttrs);
            };

            this.message = this.isNot ? shouldBeDifferentMessage : shouldBeEqualMessage;

            return isSameLength && !differentAttrs.length;
          }
        });
      });


      it('should return a reverse version of waypoints in a route', function() {
        var reverseWaypoint = reverser.getRouteWaypointsInReverse();

        // Reverse of lastWaypoint
        expect(reverseWaypoint[0].attributes).toEqualAttributes({
          position: [300, 300],
          path: [],
          distance: 0,
          followDirections: 'youGotta',
          travelMode: 'FASTER_THAN_YOU'
        });

        // Reverse of middleWaypoint
        expect(reverseWaypoint[1].attributes).toEqualAttributes({
          position: [200, 200],

          // Path from last to middle
          path: [
            [300, 300],
            [250, 250],
            [200, 200]
          ],
          distance: 300.3,
          followDirections: 'youGotta',
          travelMode: 'FASTER_THAN_YOU'
        });

        // Reverse of firstWaypoint
        expect(reverseWaypoint[2].attributes).toEqualAttributes({
          position: [100, 100],
          path: [
            [200, 200],
            [150, 150],
            [100, 100]
          ],
          distance: 200.2,
          followDirections: 'nah',
          travelMode: 'THE_WORM'
        });
      });

    });

  });

});
