define([
  'aeris',
  'aeris/events',
  'jasmine',
  'sinon',
  'aeris/utils',
  'testUtils',
  'testErrors/untestedspecerror',
  'gmaps/route/waypoint',
  'mocks/waypoint',
  'gmaps/route/route',
  'vendor/underscore'
], function(aeris, Events, jasmine, sinon, utils, testUtils, UntestedSpecError, Waypoint, MockWaypoint, Route, _) {
  describe('A Route', function() {

    it('should have a unique cid, with prefix \'route_\'', function() {
      var route;

      spyOn(utils, 'uniqueId').andCallThrough();
      route = new Route();

      expect(utils.uniqueId).toHaveBeenCalled();
      expect(route.cid).toBeDefined();
      expect(route.cid).toMatch(/^route_[0-9]*/);
    });

    describe('should manage waypoints', function() {
      it('should construct with no waypoints or distance', function() {
        var route = new Route();
        expect(route.distance).toEqual(0);
        expect(route.getWaypoints()).toEqual([]);
      });

      it('should add a waypoint', function() {
        var route = new Route();
        var wpMock = new MockWaypoint({
          distance: 7
        });
        route.add(wpMock);

        expect(route.getWaypoints().length).toEqual(1);
        expect(route.distance).toEqual(7);
      });

      it('should not a add waypoint that already exists in the route', function() {
        var route = new Route();
        spyOn(route, 'has');

        route.has.andReturn(false);
        route.add(sinon.createStubInstance(Waypoint));

        route.has.andReturn(true);
        expect(function() {
          route.add(sinon.createStubInstance(Waypoint));
        }).toThrowType('InvalidArgumentError');
      });

      it('should add a waypoint at an index', function() {
        var route, newWaypoint, waypoints = [];


        // Create mock waypoints
        _.times(3, function() {
          var wp = sinon.createStubInstance(Waypoint);
          wp.cid = _.uniqueId();
          waypoints.push(wp);
        });
        newWaypoint = sinon.createStubInstance(Waypoint);
        newWaypoint.cid = _.uniqueId();

        // Create route with mock waypoints
        route = new Route(waypoints);

        // Insert a new waypoint
        route.add(newWaypoint, { at: 1 });

        // Test: waypoint was inserted
        // Use cids so we don't have to do
        // messy object comparison
        expect(route.at(0).cid).toEqual(waypoints[0].cid);
        expect(route.at(1).cid).toEqual(newWaypoint.cid);
        expect(route.at(2).cid).toEqual(waypoints[1].cid);
        expect(route.at(3).cid).toEqual(waypoints[2].cid);
      });

      describe('triggering events', function() {

        it('should trigger a \'add\' event, passing the waypoint and the route', function() {
          var route = new Route();
          var triggered = false;
          var waypoint = new MockWaypoint();

          route.on('add', function(wp, r) {
            triggered = true;
            expect(wp).toEqual(waypoint);
            expect(r).toEqual(route);
          });
          route.add(waypoint);

          expect(triggered).toBe(true);
        });

        it('should trigger \'change\' events fired by child waypoints', function() {
          var waypoint = sinon.createStubInstance(Waypoint);
          var route = new Route();


          spyOn(route, 'trigger');

          // Immediately call change event callback
          testUtils.stubEvent(waypoint, 'change', [waypoint]);

          // Add a waypoint --> bind events to waypoint --> handler are immediately called
          route.add(waypoint);

          expect(route.trigger).toHaveBeenCalledWith('change', waypoint);
        });
      });

      it('should return a waypoint by cid', function() {
        var route = new Route();

        // Create mock waypoints
        _.times(3, function() {
          var wp = sinon.createStubInstance(Waypoint);
          wp.cid = _.uniqueId();

          route.add(wp);
          expect(route.get(wp.cid)).toEqual(wp);
        });
      });

      it('should return the previous waypoint', function() {
        var route, waypoints = [];

        // Create mock waypoints
        _.times(3, function() {
          var wp = sinon.createStubInstance(Waypoint);
          wp.cid = _.uniqueId();
          waypoints.push(wp);
        });
        route = new Route(waypoints);

        expect(route.getPrevious(waypoints[0])).toBeUndefined();
        expect(route.getPrevious(waypoints[1])).toEqual(waypoints[0]);
        expect(function() {
          route.getPrevious(sinon.createStubInstance(Waypoint));
        }).toThrowType('InvalidArgumentError');
      });

      it('should return the next waypoint', function() {
        var waypoints = [
          sinon.createStubInstance(Waypoint),
          sinon.createStubInstance(Waypoint),
          sinon.createStubInstance(Waypoint)
        ];
        var route = new Route(waypoints);

        expect(route.getNext(waypoints[2])).toBeUndefined();
        expect(route.getNext(waypoints[1])).toEqual(waypoints[2]);
        expect(function() {
          route.getNext(sinon.createStubInstance(Waypoint));
        }).toThrowType('InvalidArgumentError');
      });

      it('should check if a waypoint exists in a route', function() {
        var waypoint = sinon.createStubInstance(Waypoint);
        var someOtherWaypoint = sinon.createStubInstance(Waypoint);
        var route = new Route();

        route.add(waypoint);
        expect(route.has(waypoint)).toEqual(true);
        expect(route.has(someOtherWaypoint)).toEqual(false);
      });

      it('should remove a waypoint', function() {
        var route = new Route();
        var wp = new MockWaypoint();
        route.add(wp);
        route.remove(wp);

        expect(route.getWaypoints().length).toEqual(0);
      });

      it('should not allow removing a waypoint that doesn\'t exist', function() {
        var route = new Route();
        var wp1 = new MockWaypoint({
          distance: 7
        });
        var wp2 = new MockWaypoint({
          distance: 13
        });

        route.add(wp1);

        expect(function() { route.remove(wp2); }).toThrow();
      });

      it('should reset to an array of Waypoints', function() {
        var newWaypoints = [];
        var route = new Route();

        for (var i = 0; i < 5; i++) {
          var wpOld1 = new MockWaypoint({ distance: i });
          var wpOld2 = new MockWaypoint({ distance: i + 1 });
          var wpNew = new MockWaypoint({ distance: 2 * (i + 2) });

          route.add(wpOld1);
          route.add(wpOld2);
          newWaypoints.push(wpNew);
        }

        expect(route.getWaypoints().length).toEqual(10);

        route.reset(newWaypoints);
        expect(route.getWaypoints().length).toEqual(5);
        expect(route.getWaypoints()).toEqual(newWaypoints);
      });

      it('should remove all waypoints with reset', function() {
        var route = new Route();

        for (var i = 0; i < 5; i++) {
          route.add(new MockWaypoint());
        }

        expect(route.getWaypoints().length).toEqual(5);

        route.reset();
        expect(route.getWaypoints().length).toEqual(0);
      });

      it('should return the last waypoint in the route', function() {
        var route = new Route();
        var wpMock = new MockWaypoint({
          distance: 7
        });
        var wpMock2 = new MockWaypoint({
          distance: 11
        });

        expect(route.getLastWaypoint()).toBeNull();

        route.add(wpMock);
        expect(route.getLastWaypoint().getDistance()).toEqual(7);

        route.add(wpMock2);
        expect(route.getLastWaypoint().getDistance()).toEqual(11);
      });
    });

    describe('should trigger events', function() {

      it('should trigger a \'remove\' event', function() {
        var route = new Route();
        var wp = new MockWaypoint();
        var listenerSpy = jasmine.createSpy('onRemove');

        route.on('remove', listenerSpy);

        route.add(wp);
        route.remove(wp);

        expect(listenerSpy.argsForCall[0][0]).toMatchWaypoint(wp);
        expect(listenerSpy.callCount).toEqual(1);
      });

      it('should optionally supress event triggers', function() {
        var route = new Route();
        var addSpy = jasmine.createSpy('add');
        var removeSpy = jasmine.createSpy('remove');
        var resetSpy = jasmine.createSpy('reset');
        var wp = new MockWaypoint();

        route.on('add', addSpy);
        route.on('remove', removeSpy);
        route.on('reset', resetSpy);

        route.add(wp, { trigger: false });
        route.remove(wp, { trigger: false });
        route.reset([new MockWaypoint(), new MockWaypoint()], { trigger: false });

        expect(addSpy).not.toHaveBeenCalled();
        expect(removeSpy).not.toHaveBeenCalled();
        expect(resetSpy).not.toHaveBeenCalled();
      });

      it('should trigger only a \'reset\' event on reset', function() {
        var route = new Route();
        var newWaypoints = [new MockWaypoint(), new MockWaypoint()];
        var resetListener = jasmine.createSpy('resetListener');
        var removeListener = jasmine.createSpy('removeListener');
        var addListener = jasmine.createSpy('addListener');

        for (var i = 0; i < 5; i++) {
          var wp = new MockWaypoint({
            distance: i + 1
          });
          route.add(wp);
        }

        route.on('remove', removeListener);
        route.on('reset', resetListener);

        route.reset(newWaypoints);
        expect(resetListener).toHaveBeenCalledWith(route.getWaypoints());
        expect(resetListener.callCount).toEqual(1);

        expect(removeListener).not.toHaveBeenCalled();
        expect(addListener).not.toHaveBeenCalled();
      });
    });

    describe('should calculate total distance', function() {
      it('when adding multiple waypoints', function() {
        var route = new Route();
        var wpMock = new MockWaypoint({
          distance: 7
        });
        var wpMock2 = new MockWaypoint({
          distance: 11
        });

        route.add(wpMock);
        route.add(wpMock2);
        expect(route.getWaypoints().length).toEqual(2);
        expect(route.distance).toEqual(18);
      });

      it('when removing waypoints', function() {
        var route = new Route();
        var wp = new MockWaypoint();

        route.add(wp);
        route.remove(wp);

        expect(route.distance).toEqual(0);
      });

      it('when resetting waypoints', function() {
        var route = new Route();
        var newWaypoints = [];

        for (var i = 0; i < 5; i++) {
          var wp = new MockWaypoint({
            distance: 1
          });
          route.add(wp);
        }

        expect(route.distance).toEqual(5);

        for (var i = 0; i < 5; i++) {
          var wp = new MockWaypoint({
            distance: 2
          });
          newWaypoints.push(wp);
        }

        route.reset(newWaypoints);
        expect(route.distance).toEqual(10);

        route.reset();
        expect(route.distance).toEqual(0);
      });

      it('should update total distance when a waypoint\'s distance changes', function() {
        var route = new Route([
          new MockWaypoint({ distance: 1 }, true),
          new MockWaypoint({ distance: 2 }),
          new MockWaypoint({ distance: 3 })
        ]);

        route.getWaypoints()[1].setDistance(100);

        expect(route.distance).toEqual(104);
      });
    });

    describe('should bind to waypoint events', function() {
      it('should unbind from waypoint events', function() {
        var route;
        var waypoints = [
          new MockWaypoint(null, true),
          new MockWaypoint(),
          new MockWaypoint()
        ];

        spyOn(waypoints[1], 'on');
        spyOn(waypoints[1], 'off');

        route = new Route(waypoints);
        route.remove(waypoints[1]);

        expect(waypoints[1].on.callCount).toEqual(waypoints[1].off.callCount);
      });
    });

    describe('should import/export to JSON', function() {

      describe('should export an array of waypoints', function() {
        it('as a JSON object, using toJSON', function() {
          var route = new Route();
          var wpMock = new MockWaypoint({
            distance: 7
          });
          var wpMock2 = new MockWaypoint({
            distance: 11
          });

          spyOn(wpMock, 'toJSON').andReturn({ 'some': 'jsonObject' });
          spyOn(wpMock2, 'toJSON').andReturn({ 'another': 'jsonObject' });

          route.add(wpMock);
          route.add(wpMock2);

          // Just testing that we return an array of waypoints,
          // not the results of waypoint.toJSON
          expect(_.isEqual(route.toJSON(), [
            { 'some': 'jsonObject' },
            { 'another': 'jsonObject' }
          ])).toEqual(true);
        });

        it('as a JSON string, using export', function() {
          var waypoints, route, jsonExport;

          spyOn(aeris.maps.gmaps.route.Waypoint.prototype, 'toJSON').andReturn({ some: 'value' });

          route = new Route([new MockWaypoint(null, true), new MockWaypoint(), new MockWaypoint()]);
          jsonExport = route.export();

          expect(aeris.maps.gmaps.route.Waypoint.prototype.toJSON.callCount).toEqual(3);
          expect(jsonExport).toEqual('[' +
            '{"some":"value"},' +
            '{"some":"value"},' +
            '{"some":"value"}' +
          ']');

          // Make sure json is parseable
          JSON.parse(jsonExport);
        });
      });

      describe('should import', function() {

        it('a JSON waypoints object', function() {
          // Taken from an example export
          //var json = [{'latLon': [44.978915624496295, -93.26489210128784], 'geocodedLatLon': [44.97892, -93.26491000000001], 'followDirections': true, 'travelMode': 'WALKING', 'path': null, 'distance': 0}, {'latLon': [44.97666917019782, -93.26875448226929], 'geocodedLatLon': [44.976670000000006, -93.26877], 'followDirections': true, 'travelMode': 'WALKING', 'path': [[44.97892, -93.26491000000001], [44.978030000000004, -93.26566000000001], [44.978640000000006, -93.26706], [44.97764, -93.26794000000001], [44.976670000000006, -93.26877]], 'distance': 502}, {'latLon': [44.975895033800114, -93.26392650604248], 'geocodedLatLon': [44.97592, -93.2639], 'followDirections': true, 'travelMode': 'WALKING', 'path': [[44.976670000000006, -93.26877], [44.97764, -93.26794000000001], [44.97702, -93.26651000000001], [44.97592, -93.2639]], 'distance': 497}];
          var json = [
            new MockWaypoint({ distance: 2 }, true),
            new MockWaypoint({ distance: 4 }),
            new MockWaypoint({ distance: 6 })
          ];
          var route = new Route();
          var waypoints;

          var eventFlag = false;
          route.on('topic', function() {
            eventFlag = true;
          });

          route.reset(json);
          waypoints = route.getWaypoints();

          // Test: meta-data imported
          expect(route.distance).toEqual(12);

          // Test: waypoints imported
          //      note: not testing parsing of Waypoints (belongs in Waypoint's spec)
          expect(waypoints.length).toEqual(3);
          expect(waypoints[0] instanceof Waypoint).toEqual(true);

          // Make sure we didn't lose our subscribers.
          route.trigger('topic');
          expect(eventFlag).toEqual(true);
        });

        it('a JSON string of waypoints', function() {
          var route = new Route();
          spyOn(route, 'reset');

          route.import('{ "foo": "bar" }');
          expect(route.reset.mostRecentCall.args[0]).toEqual({ foo: 'bar' });
          expect(route.reset.callCount).toEqual(1);
        });

        it('but reject poorly formed JSON input', function() {
          var notJSON = 'imposter';
          var route = new Route();

          expect(function() { route.reset(notJSON); }).toThrowType('InvalidArgumentError');
          expect(function() { route.import({ foo: 'bar' }); }).toThrowType('JSONParseError');
        });

        it('what it exports, as a JSON object', function() {
          var routeExporter = new Route();
          var routeImporter = new Route();
          var waypoints = [
            new MockWaypoint(null, true),
            new MockWaypoint(),
            new MockWaypoint()
          ];

          for (var i = 0; i < waypoints.length; i++) {
            routeExporter.add(waypoints[i]);
          }

          routeImporter.reset(routeExporter.toJSON());
          expect(routeImporter).toMatchRoute(routeExporter);
        });

        it('what it exports, as a JSON string', function() {
          var routeExporter = new Route();
          var routeImporter = new Route();
          var waypoints = [
            new MockWaypoint(null, true),
            new MockWaypoint(),
            new MockWaypoint()
          ];

          for (var i = 0; i < waypoints.length; i++) {
            routeExporter.add(waypoints[i]);
          }

          routeImporter.import(routeExporter.export());
          expect(routeImporter).toMatchRoute(routeExporter);
        });
      });

      it('should accept a collection of waypoints as a constructor param', function() {
        var waypoints = [
          new MockWaypoint(null, true),
          new MockWaypoint(),
          new MockWaypoint()
        ];
        var route = new Route(waypoints);

        expect(route.getWaypoints().length).toEqual(waypoints.length);

        for (var i = 0; i < waypoints.length; i++) {
          expect(route.getWaypoints()[i]).toMatchWaypoint(waypoints[i]);
        }
      });
    });
  });
});
