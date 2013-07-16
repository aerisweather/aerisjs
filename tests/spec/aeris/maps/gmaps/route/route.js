define(['jasmine', 'gmaps/route/route', 'underscore'], function(jasmine, Route, _) {
  describe('A Route', function() {

    function getMockWaypoint(opt_options) {
      opt_options || (opt_options = {});
      return {
        distance: opt_options.distance || 0,
        previous: opt_options.previous || null,
        toJSON: function() {}
      }
    }

    it('should construct with no waypoints or distance', function() {
      var route = new Route();
      expect(route.distance).toEqual(0);
      expect(route.getWaypoints()).toEqual([]);
    });

    it('should add a waypoint', function() {
      var route = new Route();
      var wpMock = getMockWaypoint({
        distance: 7
      });
      route.addWaypoint(wpMock);

      expect(route.getWaypoints().length).toEqual(1);
      expect(route.distance).toEqual(7);
    });

    it('should trigger a \'addWaypoint\' event', function() {
      var route = new Route();
      var triggered = false;

      route.on('addWaypoint', function() {
        triggered = true;
      });
      route.addWaypoint(getMockWaypoint());

      expect(triggered).toBe(true);
    });

    it('should add multiple waypoints, and calculate total route distance', function() {
      var route = new Route();
      var wpMock = getMockWaypoint({
        distance: 7
      });
      var wpMock2 = getMockWaypoint({
        distance: 11
      });

      route.addWaypoint(wpMock);
      route.addWaypoint(wpMock2);
      expect(route.getWaypoints().length).toEqual(2);
      expect(route.distance).toEqual(18);
    });

    it('should tell each waypoint about the previous waypoint in the route', function() {
      var route = new Route();
      var wpMock = getMockWaypoint({
        distance: 7
      });
      var wpMock2 = getMockWaypoint({
        distance: 11
      });

      route.addWaypoint(wpMock);
      expect(wpMock.previous).toBeNull();
      route.addWaypoint(wpMock2);
      expect(wpMock2.previous.distance).toEqual(7);
    });

    it('should return the last waypoint in the route', function() {
      var route = new Route();
      var wpMock = getMockWaypoint({
        distance: 7
      });
      var wpMock2 = getMockWaypoint({
        distance: 11
      });

      expect(route.getLastWaypoint()).toBeNull();

      route.addWaypoint(wpMock);
      expect(route.getLastWaypoint().distance).toEqual(7);

      route.addWaypoint(wpMock2);
      expect(route.getLastWaypoint().distance).toEqual(11);
    });

    it('should serialize as a JSON object', function() {
      var route = new Route();
      var wpMock = getMockWaypoint({
        distance: 7
      });
      var wpMock2 = getMockWaypoint({
        distance: 11
      });

      spyOn(wpMock, 'toJSON').andReturn({ 'some': 'jsonObject' });
      spyOn(wpMock2, 'toJSON').andReturn({ 'another': 'jsonObject' });

      route.addWaypoint(wpMock);
      route.addWaypoint(wpMock2);

      expect(_.isEqual(route.toJSON(), {
        distance: 18,
        waypoints: [
          { 'some': 'jsonObject' },
          { 'another': 'jsonObject' }
        ]
      })).toEqual(true);
    });
  });
});
