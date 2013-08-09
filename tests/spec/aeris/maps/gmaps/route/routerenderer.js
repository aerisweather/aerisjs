define([
  'aeris',
  'jasmine',
  'sinon',
  'testUtils',
  'testErrors/untestedspecerror',
  'gmaps/utils',
  'vendor/underscore',
  'base/markers/icon',
  'mocks/waypoint',
  'gmaps/route/route',
  'gmaps/route/waypoint',
  'gmaps/route/routerenderer',
  'gmaps/map'
], function(aeris, jasmine, sinon, testUtils, UntestedSpecError, mapUtils, _, Icon, MockWaypoint, Route, Waypoint, RouteRenderer, AerisMap) {

  function getStubbedWaypoint(opt_options) {
    var waypoint = sinon.createStubInstance(Waypoint);

    waypoint.followDirections = opt_options.followDirections || waypoint.followDirections;

    if (opt_options.selected) {
      spyOn(waypoint, 'isSelected').andReturn(opt_options.selected);
    }

    if (opt_options.latLon) {
      spyOn(waypoint, 'getLatLon').andReturn(opt_options.latLon);
    }

    return waypoint;
  }

  function getStubbedRoute(opt_waypoint) {
    var route = sinon.createStubInstance(Route);

    if (opt_waypoint) {
      spyOn(route, 'has').andCallFake(function(waypoint) {
        return waypoint === opt_waypoint;
      });
    }

    return route;
  }


  describe('A RouteRenderer', function() {
    var map;

    beforeEach(function() {
      map = sinon.createStubInstance(AerisMap);

      // Stub the Icon's setMap method
      spyOn(aeris.maps.markers.Icon.prototype, 'setMap');
    });

    afterEach(function() {
      map = null;
    });


    describe('should render a waypoint', function() {
      var Polyline_orig = google.maps.Polyline;
      var polyline;
      var setMapSpy;

      beforeEach(function() {
        setMapSpy = jasmine.createSpy();

        spyOn(google.maps, 'Polyline').andCallFake(function() {
          polyline = new Polyline_orig(arguments);
          polyline.setMap = setMapSpy;
          return polyline;
        });
      });

      it('with an icon', function() {
        var renderer = new RouteRenderer(map);
        var exp_latLon = testUtils.getRandomLatLon();
        var waypoint = getStubbedWaypoint({ latLon: exp_latLon });
        var route = getStubbedRoute(waypoint);
        var setMapSpy = jasmine.createSpy('setMap');

        // Spy on Icon constructor
        spyOn(aeris.maps.markers, 'Icon').andCallFake(function(latLon) {
          expect(latLon).toEqual(exp_latLon);
          return { setMap: setMapSpy };
        });

        // Limiting test scope...
        waypoint.path = null;
        spyOn(renderer, 'proxyEvents');

        renderer.renderWaypoint(waypoint, route);
        expect(aeris.maps.markers.Icon).toHaveBeenCalled();
        expect(setMapSpy).toHaveBeenCalled();
      });



      it('and require the waypoint to belong to a route', function() {
        var renderer = new RouteRenderer(map);
        var waypoint = new MockWaypoint();
        var route = new Route([waypoint]);
        var unrelatedRoute = new Route();

        expect(function() {
          renderer.renderWaypoint(waypoint, undefined);
        }).toThrowType('InvalidArgumentError');

        expect(function() {
          renderer.renderWaypoint(waypoint, unrelatedRoute);
        }).toThrowType('InvalidArgumentError');

        renderer.renderWaypoint(waypoint, route);
      });

      it('with a Polyline path', function() {
        var renderer = new RouteRenderer(map);
        var route, waypoint, setMapSpy;

        // Mock waypoint
        waypoint = sinon.createStubInstance(Waypoint);
        waypoint.path = testUtils.getRandomPath();

        // Mock route
        route = sinon.createStubInstance(Route);
        spyOn(route, 'getPrevious')
          .andCallFake(function(wp) {
            expect(wp).toEqual(waypoint);
            return sinon.createStubInstance(Waypoint);
          });
        spyOn(route, 'has')
          .andCallFake(function(wp) {
            expect(wp).toEqual(waypoint);
            return true;
          });


        // Mock Polyline
        setMapSpy = jasmine.createSpy('setMap');
        google.maps.Polyline.andCallFake(function(args) {
          expect(args.path).toBeNearPath(mapUtils.pathToLatLng(waypoint.path));

          return {
            setMap: setMapSpy
          };
        });

        // Render the waypoint
        renderer.renderWaypoint(waypoint, route);

        // Test: constructed Polyine
        expect(google.maps.Polyline).toHaveBeenCalled();

        // Test: Polyline added to map
        expect(setMapSpy).toHaveBeenCalled();
      });


      describe('should accept style options', function() {
        beforeEach(function() {
          // Stub as no-op
          // to limit test scope
          spyOn(RouteRenderer.prototype, 'proxyEvents');
        });

        function testWaypointOptions(isSelected) {
          var renderer, rendererOptions = {};
          var waypointOptions = {
            url: 'internet.com/awesomeIcon.omg',
            width: 923,
            height: 123,
            clickable: false,
            draggable: false
          };
          var waypoint = getStubbedWaypoint({ selected: isSelected });
          var route = getStubbedRoute(waypoint);

          waypoint.path = null;

          rendererOptions.waypoint = isSelected ? undefined : waypointOptions;
          rendererOptions.selectedWaypoint = isSelected ? waypointOptions : undefined;

          renderer = new RouteRenderer(map, {
            waypoint: waypointOptions
          });

          spyOn(aeris.maps.markers, 'Icon').andCallFake(function(latLon, url, w, h, opts) {
            expect(url).toEqual(waypointOptions.url);
            expect(w).toEqual(waypointOptions.width);
            expect(h).toEqual(waypointOptions.height);
            expect(opts.clickable).toEqual(waypointOptions.clickable);
            expect(opts.draggable).toEqual(waypointOptions.draggable);

            return { setMap: function() {} };
          });

          renderer.renderWaypoint(waypoint, route);
          expect(aeris.maps.markers.Icon).toHaveBeenCalled();
        }

        function testPathOptions(isFollowingDirections) {
          var renderer, rendererOptions = {};
          var pathOptions = {
            strokeColor: 'purple',
            strokeOpacity: 0.2537,
            strokeWeight: 10
          };
          var waypoint = getStubbedWaypoint({ followDirections: isFollowingDirections});
          var route = getStubbedRoute(waypoint);
          var polylineSpy = google.maps.Polyline.isSpy ?
            google.maps.Polyline :
            spyOn(google.maps, 'Polyline');

          rendererOptions.path = isFollowingDirections ? pathOptions : undefined;
          rendererOptions.offPath = isFollowingDirections ? undefined : pathOptions;
          renderer = new RouteRenderer(map, rendererOptions);

          waypoint.path = testUtils.getRandomPath();

          // Stub out icon rendering
          spyOn(aeris.maps.markers, 'Icon').andReturn({
            setMap: function() {}
          });

          // Mock Polyline constructor
          polylineSpy.andCallFake(function(actual) {
            expect(actual.strokeColor).toEqual(pathOptions.strokeColor);
            expect(actual.strokeOpacity).toEqual(pathOptions.strokeOpacity);
            expect(actual.strokeWeight).toEqual(pathOptions.strokeWeight);

            return { setMap: function() {} };
          });

          renderer.renderWaypoint(waypoint, route);
          expect(google.maps.Polyline).toHaveBeenCalled();
        }

        it('for a waypoint', function() {
          testWaypointOptions(false);
        });

        it('for a selected waypoint', function() {
          testWaypointOptions(false);
        });

        it('for a path', function() {
          testPathOptions(true);
        });

        it('for a path not following directions', function() {
          testPathOptions(false);
        });
      });
    });

    it('should not render a non-waypoint', function() {
      var renderer = new RouteRenderer(map);

      expect(function() {
        renderer.renderWaypoint({ foo: 'bar' });
      }).toThrowType('InvalidArgumentError');
    });

    it('should render a route', function() {
      var renderer = new RouteRenderer(map);
      var waypoints = [
        new MockWaypoint(null, true),
        new MockWaypoint(),
        new MockWaypoint()
      ];
      var route = new Route([waypoints[0], waypoints[1], waypoints[2]]);

      spyOn(renderer, 'renderWaypoint');

      renderer.renderRoute(route);

      expect(renderer.renderWaypoint).toHaveBeenCalled();
      expect(renderer.renderWaypoint.callCount).toEqual(3);
      expect(renderer.renderWaypoint.argsForCall).toEqual([
        [waypoints[0], route], // args for call 0
        [waypoints[1], route], // args for call 1
        [waypoints[2], route]  // args for call 2
      ]);
    });

    it('should remove a route', function() {
      var renderer = new RouteRenderer(map);
      var waypoints = [
        new MockWaypoint(null, true),
        new MockWaypoint(),
        new MockWaypoint()
      ];
      var route = new Route(waypoints);

      renderer.renderRoute(route);
      renderer.renderRoute(new Route(waypoints));     // to make sure we only remove the req'd route

      spyOn(google.maps.Polyline.prototype, 'setMap');
      spyOn(aeris.maps.markers.Icon.prototype, 'remove');

      renderer.eraseRoute(route);
      expect(google.maps.Polyline.prototype.setMap).toHaveBeenCalledWith(null);
      expect(google.maps.Polyline.prototype.setMap.callCount).toEqual(2);

      expect(aeris.maps.markers.Icon.prototype.remove.callCount).toEqual(3);
    });

    it('should remove a waypoint', function() {
      var renderer = new RouteRenderer(map);
      var waypoints = [
        new MockWaypoint(null, true),
        new MockWaypoint(),
        new MockWaypoint()
      ];
      var route = new Route(waypoints);

      renderer.renderRoute(route);

      spyOn(google.maps.Polyline.prototype, 'setMap');
      spyOn(aeris.maps.markers.Icon.prototype, 'remove');

      renderer.eraseWaypoint(waypoints[1], route);

      // Test: Removes a waypoint's Icon
      expect(aeris.maps.markers.Icon.prototype.remove.callCount).toEqual(1);

      // Test: Removes waypoint's path
      expect(google.maps.Polyline.prototype.setMap).toHaveBeenCalledWith(null);
      expect(google.maps.Polyline.prototype.setMap.callCount).toEqual(1);
    });

    it('should re-render a waypoint', function() {
      var tmpWp = new MockWaypoint();
      var renderer = new RouteRenderer(map);
      var waypoints = [
        new MockWaypoint(null, true),
        new MockWaypoint(),
        new MockWaypoint()
      ];
      var route = new Route(waypoints);
      renderer.renderRoute(route);

      spyOn(google.maps.Polyline.prototype, 'setPath');
      spyOn(google.maps.Polyline.prototype, 'setMap');
      spyOn(aeris.maps.markers.Icon.prototype, 'remove');

      // Adjust and redraw middle waypoint path
      route.getWaypoints()[1].path = tmpWp.path;
      route.getWaypoints()[1].geocodedLatLon = tmpWp.geocodedLatLon;
      renderer.renderWaypoint(route.getWaypoints()[1], route);

      // Test: remove old path and Icon
      expect(google.maps.Polyline.prototype.setMap).toHaveBeenCalledWith(null);
      expect(aeris.maps.markers.Icon.prototype.remove).toHaveBeenCalled();

      // Test: draw new path and Icon
      expect(google.maps.Polyline.prototype.setPath).toHaveBeenCalled();
      expect(aeris.maps.markers.Icon.prototype.setMap).toHaveBeenCalledWith(map);
    });

    it('should clear all rendered objects', function() {
      var renderer = new RouteRenderer(map);
      var waypoints = [
        new MockWaypoint(null, true),
        new MockWaypoint(),
        new MockWaypoint()
      ];
      var route1 = new Route(waypoints);
      var route2 = new Route(waypoints);


      renderer.renderRoute(route1);
      renderer.renderRoute(route2);

      spyOn(google.maps.Polyline.prototype, 'setMap');
      spyOn(aeris.maps.markers.Icon.prototype, 'remove');

      renderer.eraseAllRoutes();
      expect(google.maps.Polyline.prototype.setMap).toHaveBeenCalledWith(null);
      expect(google.maps.Polyline.prototype.setMap.callCount).toEqual(4);

      expect(aeris.maps.markers.Icon.prototype.remove.callCount).toEqual(6);
    });
  });
});
