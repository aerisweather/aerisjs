define([
    'aeris',
    'jasmine',
    'sinon',
    'gmaps/route/route',
    'gmaps/route/routerenderer',
    'gmaps/map',
    'base/markers/icon'
], function(aeris, jasmine, sinon, Route, RouteRenderer, AerisMap, Icon) {
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

    it('should render a waypoint when it\' added to a route', function() {
      var route = new Route();
      var rR;

      spyOn(RouteRenderer.prototype, 'renderWaypoint');
      rR = new RouteRenderer(map);

      rR.setRoute(route);
      route.trigger('addWaypoint', { foo: 'bar' });
      expect(rR.renderWaypoint).toHaveBeenCalledWith({foo: 'bar'});
    });

    it('should draw a path', function() {
      // Check: polyline constructs with path
      var rR = new RouteRenderer(map);
      var fakePath = [
        new google.maps.LatLng([45, -90]),
        new google.maps.LatLng([45, -90])
      ];
      var path;
      var setMapSpy = jasmine.createSpy('setMap');

      // Spy on gmaps.Polyline constructor
      spyOn(google.maps, 'Polyline').andCallFake(function(options) {
        path = options.path;
        return {
          setMap: setMapSpy
        };
      });

      rR.drawPath(fakePath);

      // Polyline constructs with provided path
      expect(path).toEqual(fakePath);

      // Adds the polyline to the map
      expect(setMapSpy).toHaveBeenCalled();
    });

    it('should draw an Icon on the map', function() {
      var rR = new RouteRenderer(map);
      var setMapSpy = jasmine.createSpy('setMap');
      var mockWaypoint = { getLatLon: function() {} };

      // Spy on Icon constructor
      spyOn(aeris.maps.markers, 'Icon').andReturn({
        // Spy on Icon.setMap
        setMap: setMapSpy
      });

      rR.drawIcon(mockWaypoint);

      // Test: Icon was created
      expect(aeris.maps.markers.Icon).toHaveBeenCalled();

      // Test: Icon was set to map
      expect(setMapSpy).toHaveBeenCalledWith(map);
    });

    it('should render a waypoint following a path', function() {
      var rR = new RouteRenderer(map);
      var mockWp = {
        followPaths: true,
        path: { mock: 'path' }
      };

      spyOn(rR, 'drawPath');
      spyOn(rR, 'drawIcon');
      rR.renderWaypoint(mockWp);

      // Should draw the waypoint's path
      expect(rR.drawPath).toHaveBeenCalledWith(mockWp.path);
    });

    it('should render a waypoint not following a path', function() {
      var rR = new RouteRenderer(map);
      var prevPoint = [45, -90];
      var currPoint = [45.1, -90.1];
      var mockWp = {
        getLatLon: jasmine.createSpy('gLL').andReturn(currPoint),
        followPaths: false,
        previous: {
          getLatLon: jasmine.createSpy('prvGLL').andReturn(prevPoint)
        }
      };

      spyOn(rR, 'drawPath');
      spyOn(rR, 'drawIcon');
      rR.renderWaypoint(mockWp);

      // Should draw a path directly from the last wp to this wp
      expect(rR.drawPath).toHaveBeenCalled();
      expect(rR.drawPath.mostRecentCall.args).toContain([prevPoint, currPoint]);
    });
  });
});
