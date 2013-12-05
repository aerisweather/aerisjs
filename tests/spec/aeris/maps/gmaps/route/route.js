define([
  'aeris/events',
  'jasmine',
  'sinon',
  'aeris/util',
  'aeris/model',
  'testUtils',
  'testErrors/untestedspecerror',
  'gmaps/route/waypoint',
  'gmaps/route/directions/abstractdirectionsservice',
  'mocks/promise',
  'aeris/promise',
  'gmaps/route/route'
], function(
  Events,
  jasmine,
  sinon,
  _,
  Model,
  testUtils,
  UntestedSpecError,
  Waypoint,
  DirectionsService,
  StubbedPromise,
  Promise,
  Route
) {

  var MockWaypoint = function(opt_attrs, opt_options) {
    // Use Model ctor
    Model.apply(this, arguments);
  };
  _.inherits(MockWaypoint, Waypoint);


  var MockDirectionsService = function() {
    this.fetchPath = jasmine.createSpy('DirectionsService#fetchPath');
  };



  function getStubbedWaypoint(opt_options) {
    var options = _.extend({}, opt_options);
    var waypoint = sinon.createStubInstance(Waypoint);

    if (!_.isUndefined(options.distance)) {
      spyOn(waypoint, 'getDistance').andReturn(options.distance);
    }

    if (!_.isUndefined(options.selected)) {
      spyOn(waypoint, 'isSelected').andReturn(options.selected);
    }

    return waypoint;
  }

  function getStubbedWaypointCollection(count, opt_options) {
    var options = _.extend({}, opt_options);
    var waypoints = [];

    count || (count = 3);

    _.times(count, function() {
      waypoints.push(getStubbedWaypoint(options));
    });

    return waypoints;
  }

  function getStubbedWaypointsForRoute(route, count, opt_options) {
    var waypoints = getStubbedWaypointCollection(count, opt_options);

    spyOn(route, 'getWaypoints').andReturn(waypoints);
    spyOn(route, 'has').andCallFake(function(wp) {
      return _.indexOf(waypoints, wp) >= 0;
    });

    spyOn(route, 'at').andCallFake(function(index) {
      return waypoints[index];
    });


    return waypoints;
  }


  describe('A Route', function() {

    it('should have a unique cid, with prefix \'route_\'', function() {
      var route;

      spyOn(_, 'uniqueId').andCallThrough();
      route = new Route();

      expect(_.uniqueId).toHaveBeenCalled();
      expect(route.cid).toBeDefined();
      expect(route.cid).toMatch(/^route_[0-9]*/);
    });

    describe('should manage waypoints', function() {

      beforeEach(function() {
        // Stub out waypoint path updating
        // stub out path updating
        spyOn(Route.prototype, 'updatePaths').andReturn(new Promise());
        spyOn(Route.prototype, 'updatePathBetween').andReturn(new Promise());
      })


      it('should construct with no waypoints or distance', function() {
        var route = new Route();
        expect(route.distance).toEqual(0);
        expect(route.getWaypoints()).toEqual([]);
      });

      describe('add method', function() {
        var route, waypoint;

        beforeEach(function() {
          route = new Route();
          waypoint = new MockWaypoint();
        });

        it('should add a waypoint', function() {
          route.add(waypoint);

          expect(route.getWaypoints().length).toEqual(1);
        });

        it('should trigger an \'add\' event', function() {
          var addListener = jasmine.createSpy('addListener');

          route.on('add', addListener);

          route.add(waypoint);
          expect(addListener).toHaveBeenCalled();
        });

        it('should not a add waypoint that already exists in the route', function() {
          route.add(waypoint);
          route.add(waypoint);
          expect(route.length).toEqual(1);
        });

        it('should add a waypoint at an index', function() {
          var newWaypoint, waypoints = [];

          // Create mock waypoints
          // and add them to the route
          _.times(3, function(i) {
            var wp = getStubbedWaypoint();
            wp.testId = 'oldWaypoint_' + i;
            waypoints.push(wp);
            route.add(wp);
          });
          newWaypoint = getStubbedWaypoint();
          newWaypoint.testId = 'newWaypoint';

          // Insert a new waypoint
          route.add(newWaypoint, { at: 1 });

          // Test: waypoint was inserted
          expect(route.at(0)).toEqual(waypoints[0]);
          expect(route.at(1)).toEqual(newWaypoint);
          expect(route.at(2)).toEqual(waypoints[1]);
          expect(route.at(3)).toEqual(waypoints[2]);
        });

        it('should add multiple waypoints', function() {
          var route = new Route();
          var waypoints = getStubbedWaypointCollection();

          spyOn(route, 'trigger');
          spyOn(route, 'contains').andReturn(false);

          route.add(waypoints);
          expect(route.getWaypoints()).toEqual(waypoints);
        });
      });

      it('should return a waypoint by cid', function() {
        var route = new Route();

        // Stub out as no-op
        // To limit test scope
        spyOn(route, 'trigger');

        // Create mock waypoints
        _.times(3, function() {
          var wp = sinon.createStubInstance(Waypoint);
          wp.cid = _.uniqueId();

          route.add(wp);
          expect(route.get(wp.cid)).toEqual(wp);
        });
      });

      it('should return a waypoint at an offset from another', function() {
        var route = new Route(undefined, {
          directionsService: new MockDirectionsService()
        });
        var waypoints = [new MockWaypoint(), new MockWaypoint(), new MockWaypoint()];

        route.add(waypoints);

        expect(route.atOffset(waypoints[0], 1)).toEqual(waypoints[1]);
        expect(route.atOffset(waypoints[0], 2)).toEqual(waypoints[2]);
        expect(route.atOffset(waypoints[1], 1)).toEqual(waypoints[2]);
        expect(route.atOffset(waypoints[1], -1)).toEqual(waypoints[0]);
        expect(route.atOffset(waypoints[2], -1)).toEqual(waypoints[1]);
        expect(route.atOffset(waypoints[2], -2)).toEqual(waypoints[0]);
      });

      it('should return the previous waypoint', function() {
        var route = new Route();
        var waypoint = getStubbedWaypoint();

        spyOn(route, 'atOffset');

        route.getPrevious(waypoint);
        expect(route.atOffset).toHaveBeenCalledWith(waypoint, -1);
      });

      it('should return the next waypoint', function() {
        var route = new Route();
        var waypoint = getStubbedWaypoint();

        spyOn(route, 'atOffset');

        route.getNext(waypoint);
        expect(route.atOffset).toHaveBeenCalledWith(waypoint, 1);
      });

      describe('selected waypoints', function() {
        it('should return selected waypoints', function() {
          var waypoints = [
            new MockWaypoint({ selected: true }),   // 0
            new MockWaypoint({ selected: false }),  // 1
            new MockWaypoint({ selected: true }),   // 2
            new MockWaypoint({ selected: false }),  // 3
            new MockWaypoint({ selected: true })    // 4
          ];
          var route = new Route(waypoints);

          expect(route.getSelected()).toEqual([
            waypoints[0], waypoints[2], waypoints[4]
          ]);
        });

        it('should select all waypoints', function() {
          var waypoints = [
            new MockWaypoint(),
            new MockWaypoint(),
            new MockWaypoint()
          ];
          var route = new Route(waypoints);

          // Spy on 'select' method
          _.each(waypoints, function(wp, i) {
            wp.select = jasmine.createSpy('select_' + i);
          });

          route.selectAll();

          _.each(waypoints, function(wp) {
            expect(wp.select).toHaveBeenCalled();
          });
        });

        it('should deselect all waypoints', function() {
          var waypoints = [
            new MockWaypoint(),
            new MockWaypoint(),
            new MockWaypoint()
          ];
          var route = new Route(waypoints);

          // Spy on 'select' method
          _.each(waypoints, function(wp, i) {
            wp.deselect = jasmine.createSpy('select_' + i);
          });

          route.deselectAll();

          _.each(waypoints, function(wp) {
            expect(wp.deselect).toHaveBeenCalled();
          });
        });
      });

      it('should check if a waypoint exists in a route', function() {
        var waypoint = getStubbedWaypoint();
        var someOtherWaypoint = getStubbedWaypoint();
        var route = new Route();

        // Stub with no-op to  limit test scope
        spyOn(route, 'trigger');

        route.add(waypoint);
        expect(route.contains(waypoint)).toEqual(true);
        expect(route.contains(someOtherWaypoint)).toEqual(false);
      });


      it('should return the last waypoint in the route', function() {
        var route = new Route();
        var count = 3;
        var waypoints = getStubbedWaypointCollection(count);

        spyOn(route, 'getWaypoints').andReturn(waypoints);
        spyOn(route, 'at');

        route.getLastWaypoint();

        expect(route.at).toHaveBeenCalledWith(count - 1);
      });

      it('should recalculate total route distance', function() {
        var route = new Route();
        var count = 7;
        var waypointDistance = 8213;
        var waypoints = getStubbedWaypointCollection(count, { distance: waypointDistance });

        spyOn(route, 'getWaypoints').andReturn(waypoints);

        route.recalculateAndUpdateDistance();
        expect(route.distance).toEqual(count * waypointDistance);
      });

    });

    describe('distanceTo', function() {
      it('should return the distance to a given waypoint', function() {
        var waypoints = [
          new MockWaypoint({ distance: 0 }),    // 0
          new MockWaypoint({ distance: 100 }),  // 1
          new MockWaypoint({ distance: 50 }),   // 2
          new MockWaypoint({ distance: 25 })    // 3
        ];
        var route = new Route(waypoints);

        expect(route.distanceTo(waypoints[0])).toEqual(0);
        expect(route.distanceTo(waypoints[1])).toEqual(100);
        expect(route.distanceTo(waypoints[2])).toEqual(150);
        expect(route.distanceTo(waypoints[3])).toEqual(175);
      });

      it('should complain if the waypoint doesn\'t exist', function() {
        var waypoints = [
          new MockWaypoint({ distance: 0 }),    // 0
          new MockWaypoint({ distance: 100 }),  // 1
          new MockWaypoint({ distance: 50 }),   // 2
          new MockWaypoint({ distance: 25 })    // 3
        ];
        var route = new Route(waypoints);

        expect(function() {
          route.distanceTo(new MockWaypoint({ distance: 999 }));
        }).toThrowType('InvalidArgumentError');
      });
    });

    describe('should update a waypoint\'s path', function() {
      var route, waypoint, next, prev;

      beforeEach(function() {
        route = new Route();
        waypoint = getStubbedWaypoint();
        next = getStubbedWaypoint();
        prev = getStubbedWaypoint();

        spyOn(route, 'updatePathBetween');
        spyOn(aeris.Promise, 'when');
      });

      it('when it is added to a route, or moved', function() {
        spyOn(route, 'contains').andReturn(true);
        spyOn(route, 'getNext').andReturn(next);
        spyOn(route, 'getPrevious').andReturn(prev);

        route.updatePaths(waypoint);

        expect(route.updatePathBetween).toHaveBeenCalledWith(waypoint, next);
      });

      describe('when it is removed from a route', function() {
        function stubAt(at) {
          spyOn(route, 'at').andCallFake(function(index) {
            if (index === at - 1) { return undefined; }
            if (index === at) { return next }

            throw Error('Unexpected spy arguments');
          });
        }

        beforeEach(function() {
          spyOn(route, 'contains').andReturn(false);
          spyOn(next, 'set');
          spyOn(prev, 'set');
        });

        it('from the beginning of a route', function() {
          spyOn(route, 'at').andCallFake(function(index) {
            if (index === -1) { return undefined; }
            if (index === 0) { return next }

            throw Error('Unexpected spy arguments');
          });

          route.updatePaths(waypoint, 0);

          expect(next.set).toHaveBeenCalledWith({
            path: [],
            distance: 0
          });
        });

        it('from the middle of a route', function() {
          spyOn(route, 'at').andCallFake(function(index) {
            if (index === 0) { return prev; }
            if (index === 1) { return next }

            throw Error('Unexpected spy arguments');
          });

          route.updatePaths(waypoint, 1);

          expect(route.updatePathBetween).toHaveBeenCalledWith(prev, next);
        });

        it('from the end of a route', function() {
          spyOn(route, 'at').andReturn(undefined);

          route.updatePaths(waypoint, 2);

          expect(route.updatePathBetween).not.toHaveBeenCalled();
          expect(next.set).not.toHaveBeenCalled();
          expect(prev.set).not.toHaveBeenCalled();
        });
      });
    });


    it('should update a path between two waypoints', function() {
      var directionsService = new MockDirectionsService();
      var route = new Route(undefined, {
        directionsService: directionsService
      });
      var origin = getStubbedWaypoint();
      var destination = new MockWaypoint({
        followDirections: true,
        travelMode: 'DRIVING'
      });
      var res = {
        path: testUtils.getRandomPath(),
        distance: 12345
      };

      // Mock Directions service
      directionsService.fetchPath.andCallFake(function(wpOrig, wpDest, opts) {
          var promise = new Promise();

          expect(wpOrig).toEqual(origin);
          expect(wpDest).toEqual(destination);
          expect(opts).toEqual({
            followDirections: true,
            travelMode: 'DRIVING'
          });

          promise.resolve(res);
          return promise;
        });

      spyOn(destination, 'set');
      spyOn(origin, 'set');

      route.updatePathBetween(origin, destination);

      // Test: Service was called
      expect(directionsService.fetchPath).toHaveBeenCalled();

      // Test: destination path was updated
      expect(destination.set).toHaveBeenCalledWith({
        path: res.path,
        position: res.path[res.path.length - 1],
        distance: res.distance
      });
    });


    describe('should import/export to JSON', function() {

      describe('should export an array of waypoints', function() {

        it('as a JSON string, using export', function() {
          var route = new Route();

          spyOn(JSON, 'stringify');

          route.export();

          expect(JSON.stringify).toHaveBeenCalledWith(route);
        });
      });

      describe('should import', function() {
        it('a JSON string', function() {
          var route = new Route();
          var waypoints = getStubbedWaypointCollection();
          var jsonString = 'some valid json string';
          var options = { some: 'reset options'};

          spyOn(JSON, 'parse').andReturn(waypoints);
          spyOn(route, 'reset');

          route.import(jsonString, options);

          expect(JSON.parse).toHaveBeenCalledWith(jsonString);
          expect(route.reset).toHaveBeenCalledWith(waypoints, options);
        });

        it('but reject poorly formed JSON input', function() {
          var route = new Route();

          spyOn(JSON, 'parse').andCallFake(function() {
            throw new window.SyntaxError('try harder next time.');
          });

          expect(function() {
            route.import('some json string');
          }).toThrowType('JSONParseError');
        });
      });
    });
  });
});
