define([
    'aeris',
    'jasmine',
    'sinon',
    'vendor/underscore',
    'mocks/waypoint',
    'gmaps/route/route',
    'gmaps/route/routerenderer',
    'gmaps/map',
    'base/markers/icon'
], function(aeris, jasmine, sinon, _, MockWaypoint, Route, RouteRenderer, AerisMap, Icon) {
  describe('A RouteRenderer', function() {
    var map, $canvas;

    beforeEach(function() {
      $canvas = $('<div id="map-canvas"></div>').appendTo('body');
      map = new AerisMap('map-canvas', {
        center: [44.98, -93.2636],
        zoom: 15
      });

      // Wait for the map to initialize
      waitsFor(function() {
        return map.initialized.state === 'resolved';
      }, 'map to initialize', 1000);
    });

    afterEach(function() {
      map = null;
      $canvas.remove();
      $canvas.empty();
    });

    it('requires an AerisMap', function() {
      expect(function() {
        new RouteRenderer({foo: 'bar'});
      }).toThrowType('InvalidArgumentError');

      new RouteRenderer(map);
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

      it('with an associated route', function() {
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

      it('following a path', function() {
        var renderer = new RouteRenderer(map);
        var mockWp = new MockWaypoint({
          followPaths: true
        });

        renderer.renderWaypoint(mockWp, new Route([mockWp]));

        // Test: constructed Polyine
        expect(google.maps.Polyline).toHaveBeenCalled();
        expect(google.maps.Polyline.callCount).toEqual(1);

        // Test: Polyline path matches waypoint's path
        expect(google.maps.Polyline.argsForCall[0][0].path.length).toEqual(mockWp.path.length);
        _.each(google.maps.Polyline.argsForCall[0][0].path, function(latLng, i) {
          expect(latLng.lat()).toBeNear(mockWp.path[i][0], 0.01);
          expect(latLng.lng()).toBeNear(mockWp.path[i][1], 0.01);
        });

        // Test: Polyline added to map
        expect(polyline.setMap).toHaveBeenCalled();
      });

      it('not following a path', function() {
        var renderer = new RouteRenderer(map);
        var prevPoint = [45, -90];
        var currPoint = [45.1, -90.1];
        var previousWaypoint = new MockWaypoint();
        var waypoint = new MockWaypoint({
          followPaths: false,
          previous: previousWaypoint
        });

        spyOn(previousWaypoint, 'getLatLon').andReturn(prevPoint);
        spyOn(waypoint, 'getLatLon').andReturn(currPoint);

        renderer.renderWaypoint(waypoint, new Route([waypoint]));

        // Test: constructed Polyline
        expect(google.maps.Polyline).toHaveBeenCalled();
        expect(google.maps.Polyline.callCount).toEqual(1);

        // Test: Path only has two points
        expect(google.maps.Polyline.argsForCall[0][0].path.length).toEqual(2);

        // Test: Polyline path matches waypoints path
        expect(google.maps.Polyline.argsForCall[0][0].path[0].lat()).toBeNear(prevPoint[0], 0.01);
        expect(google.maps.Polyline.argsForCall[0][0].path[0].lng()).toBeNear(prevPoint[1], 0.01);
        expect(google.maps.Polyline.argsForCall[0][0].path[1].lat()).toBeNear(currPoint[0], 0.01);
        expect(google.maps.Polyline.argsForCall[0][0].path[1].lng()).toBeNear(currPoint[1], 0.01);

        // Test: Polyline added to map
        expect(polyline.setMap).toHaveBeenCalled();
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
      spyOn(aeris.maps.markers.Icon.prototype, 'setMap');
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
