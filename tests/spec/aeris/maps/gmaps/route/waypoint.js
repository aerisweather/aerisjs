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

    describe('JSON import/export', function() {
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
          '"distance":0' +
        '}');
      });

      it('should reset waypoint data from a JSON object', function() {
        // Taken from example export
        var wp, json;
        wp = new Waypoint();

        // Set non-standard options,
        // so we can detect changed=s
        wp.followPaths = false;
        wp.travelMode = 'JETPACK';

        json = {'originalLatLon': [44.972752843480855, -93.27199459075928], 'geocodedLatLon': [44.97276, -93.272], 'followPaths': true, 'travelMode': 'WALKING', 'path': [[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]], 'distance': 1153};

        wp.reset(json);

        expect(wp.distance).toEqual(1153);
        expect(wp.followPaths).toEqual(true);
        expect(wp.travelMode).toEqual('WALKING');
        expect(wp.originalLatLon).toEqual([44.972752843480855, -93.27199459075928]);
        expect(wp.geocodedLatLon).toEqual([44.97276, -93.272]);
        expect(wp.path).toEqual([[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]]);

        // Parse should remove previous waypoint:
        //  --> our imported JSON has no context
        expect(wp.previous).toBeNull();
      });

      it('should reject poorly formed JSON input', function() {
        var wp = new Waypoint();

        var goodJSON = json = {'originalLatLon': [44.972752843480855, -93.27199459075928], 'geocodedLatLon': [44.97276, -93.272], 'followPaths': true, 'travelMode': 'WALKING', 'path': [[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]], 'distance': 1153};
        var badJSONs = [
          _.extend({}, goodJSON, { distance: 'way out there' }),
          _.extend({}, goodJSON, { originalLatLon: ['this far north', 'this far west']}),
          _.extend({}, goodJSON, { followPaths: undefined }),
          _.extend({}, goodJSON, { travelMode: undefined }),
          _.extend({}, goodJSON, { path: undefined })
        ];

        for (var i = 0; i <= badJSONs.length; i++) {
          var fn = (function(j) {
            return function() {
              wp.reset(badJSONs[j]);
            }
          })(i);

          expect(fn).toThrow();
        }
      });
    });
  });
});
