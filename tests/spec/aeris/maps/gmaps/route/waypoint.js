define(['jasmine', 'gmaps/route/waypoint'], function(jasmine, Waypoint) {
  describe('A waypoint', function() {
    it('should accept waypoint properties as options on construction, and set defaults', function() {
      var wp = new Waypoint({
        originalLatLon: [-45, 90],
        geocodedLatLon: [-45.1, 90.1],
        path: ['mock', 'path']
      });

      // Defined properties
      expect(wp.originalLatLon).toEqual([-45, 90]);
      expect(wp.geocodedLatLon).toEqual([-45.1, 90.1]);
      expect(wp.path).toEqual(['mock', 'path']);

      // Some defaults
      expect(wp.followPaths).toEqual(true);
      expect(wp.travelMode).toBe('WALKING');
      expect(wp.distance).toEqual(0);
    });

    it('should return the most accurate lat/lon', function() {
      var wp = new Waypoint({
        originalLatLon: [-45, 90]
      });

      expect(wp.getLatLon()).toEqual([-45, 90]);

      // geocoded lat lon is considered more accurate, and preferred
      wp.geocodedLatLon = [-45.1, 90.1];
      expect(wp.getLatLon()).toEqual([-45.1, 90.1]);
    });

    it('should serialize as a JSON string, using the Waypoints toJSON method', function() {
      var wp = new Waypoint({
        originalLatLon: [-45, 90],
        geocodedLatLon: [-45.1, 90.1],
        followPaths: true,
        travelMode: 'WALKING',
        path: ['mock', 'path']
      });

      expect(JSON.stringify(wp)).toBe('{' +
        '"originalLatLon":[-45,90],' +
        '"geocodedLatLon":[-45.1,90.1],' +
        '"followPaths":true,' +
        '"travelMode":"WALKING",' +
        '"path":["mock","path"],' +
        '"previous":null,' +
        '"distance":0' +
      '}');
    });
  });
});
