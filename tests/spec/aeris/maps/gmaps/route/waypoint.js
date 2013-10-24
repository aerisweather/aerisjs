define([
  'jasmine',
  'testErrors/untestedspecerror',
  'gmaps/route/waypoint',
  'mocks/waypoint',
  'mocks/directionsresults',
  'aeris/util',
  'testUtils',
  'gmaps/utils'
], function(
  jasmine,
  UntestedSpecError,
  Waypoint,
  MockWaypoint,
  MockDirectionsResults,
  _,
  testUtils,
  mapUtils
) {
  describe('A Waypoint', function() {

    it('should accept waypoint properties as options on construction, and set defaults', function() {
      var wp = new Waypoint({
        position: [-45, 90],
        geocodedLatLon: [-45.1, 90.1],
        path: ['mock', 'path']
      });

      // Defined properties
      expect(wp.get('position')).toEqual([-45, 90]);
      expect(wp.get('geocodedLatLon')).toEqual([-45.1, 90.1]);
      expect(wp.get('path')).toEqual(['mock', 'path']);

      // Some defaults
      expect(wp.get('followDirections')).toEqual(true);
      expect(wp.get('travelMode')).toBe('WALKING');
      expect(wp.getDistance()).toEqual(0);
    });

    it('should reset the geocoded lat/lon when the position changes', function() {
      var wp = new Waypoint();

      wp.set({
        position: [1, 2],
        geocodedLatLon: [1.1, 2.2]
      });

      expect(wp.get('position')).toEqual([1, 2]);
      expect(wp.get('geocodedLatLon')).toEqual([1.1, 2.2]);

      wp.set('position', [100, 200]);
      expect(wp.get('position')).toEqual([100, 200]);
      expect(wp.get('geocodedLatLon')).toBeNull();

      wp.set('geocodedLatLon', [100.1, 200.2]);
      expect(wp.get('geocodedLatLon')).toEqual([100.1, 200.2]);
      expect(wp.get('position')).toEqual([100, 200]);
    });

    it('should return the most accurate lat/lon', function() {
      var wp = new Waypoint({
        position: [-45, 90]
      });

      expect(wp.getLatLon()).toEqual([-45, 90]);

      // geocoded lat lon is considered more accurate, and preferred
      wp.set('geocodedLatLon', [-45.1, 90.1]);
      expect(wp.getLatLon()).toEqual([-45.1, 90.1]);
    });

    it('should select a waypoint, without triggering eventse', function() {
      var waypoint = new Waypoint();
      var eventListener = jasmine.createSpy('\'select\' event listener');

      waypoint.on('select', eventListener);

      waypoint.select({ silent: true });
      expect(eventListener).not.toHaveBeenCalled();
    });

    it('should toggle a waypoint\'s selected attribute', function() {
      var waypoint = new Waypoint();

      spyOn(waypoint, 'isSelected');
      spyOn(waypoint, 'select');
      spyOn(waypoint, 'deselect');

      waypoint.isSelected.andReturn(false);
      waypoint.toggleSelect();
      expect(waypoint.select).toHaveBeenCalledInTheContextOf(waypoint);
      expect(waypoint.deselect).not.toHaveBeenCalled();

      waypoint.isSelected.andReturn(true);
      waypoint.toggleSelect();
      expect(waypoint.deselect).toHaveBeenCalledInTheContextOf(waypoint);
      expect(waypoint.select.callCount).toEqual(1);   // wasn't called a second time
    });

    it('should tell you if the waypoint is selected', function() {
      var waypoint = new Waypoint();

      waypoint.select();
      expect(waypoint.isSelected()).toEqual(true);

      waypoint.deselect();
      expect(waypoint.isSelected()).toEqual(false);
    });


    describe('JSON import/export', function() {
      it('export as a JSON string', function() {
        var wp = new Waypoint({
          position: [-45, 90],
          geocodedLatLon: [-45.1, 90.1],
          followDirections: true,
          travelMode: 'WALKING',
          path: ['mock', 'path']
        });

        expect(wp.export()).toEqual('{' +
          '"position":[-45,90],' +
          '"geocodedLatLon":[-45.1,90.1],' +
          '"followDirections":true,' +
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
        wp.set('followDirections', false);
        wp.set('travelMode', 'JETPACK');

        json = {"position": [44.972752843480855, -93.27199459075928], 'geocodedLatLon': [44.97276, -93.272], "followDirections": true, 'travelMode': 'WALKING', 'path': [[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]], 'distance': 1153};

        wp.reset(json);

        expect(wp.getDistance()).toEqual(1153);
        expect(wp.get('followDirections')).toEqual(true);
        expect(wp.get('travelMode')).toEqual('WALKING');
        expect(wp.get('position')).toEqual([44.972752843480855, -93.27199459075928]);
        expect(wp.get('geocodedLatLon')).toEqual([44.97276, -93.272]);
        expect(wp.get('path')).toEqual([[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]]);
      });

      it('should import waypoint data from a JSON string', function() {
        var jsonStr = '{' +
          '"position":[44.97840714423616,-93.2635509967804],' +
          '"geocodedLatLon":[44.978410000000004,-93.26356000000001],' +
          '"followDirections":true,' +
          '"travelMode":"WALKING",' +
          '"path":[[44.97905,-93.26302000000001],[44.978410000000004,-93.26356000000001]],' +
          '"distance":83' +
        '}';

        var wp = new Waypoint();
        wp.import(jsonStr);

        expect(wp.get('position')).toEqual([44.97840714423616, -93.2635509967804]);
        expect(wp.get('geocodedLatLon')).toEqual([44.978410000000004, -93.26356000000001]);
        expect(wp.get('followDirections')).toEqual(true);
        expect(wp.get('travelMode')).toEqual('WALKING');
        expect(wp.get('path')).toEqual([[44.97905, -93.26302000000001], [44.978410000000004, -93.26356000000001]]);
        expect(wp.getDistance()).toEqual(83);
      });

      it('should reject poorly formed JSON object input', function() {
        var wp = new Waypoint();

        var goodJSON = {"position": [44.972752843480855, -93.27199459075928], 'geocodedLatLon': [44.97276, -93.272], "followDirections": true, 'travelMode': 'WALKING', 'path': [[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]], 'distance': 1153};
        var badJSONs = [
          _.extend({}, goodJSON, { distance: 'way out there' }),
          _.extend({}, goodJSON, { position: ['this far north', 'this far west']}),
          _.extend({}, goodJSON, { followDirections: undefined }),
          _.extend({}, goodJSON, { travelMode: undefined }),
          _.extend({}, goodJSON, { path: undefined })
        ];

        for (var i = 0; i < badJSONs.length; i++) {
          var fn = (function(j) {
            return function() {
              wp.reset(badJSONs[j]);
            }
          })(i);

          expect(fn).toThrowType('ValidationError');
        }
      });

      it('should reject poorly formed JSON string input', function() {
        var wp = new Waypoint();

        expect(function() {
          wp.import('foo');
        }).toThrowType('JSONParseError');

        expect(function() {
          wp.import({
            foo: 'bar'
          });
        }).toThrowType('JSONParseError');
      });

      it('should import what it exports, using JSON objects', function() {
        var waypointExporter = new MockWaypoint();
        var waypointImporter = new MockWaypoint();

        waypointImporter.reset(waypointExporter.toJSON());

        expect(waypointImporter.getLatLon()).toEqual(waypointExporter.getLatLon());

        // Compare all object properties
        expect(waypointImporter).toMatchWaypoint(waypointExporter);
      });

      it('should import what is exports, using JSON strings', function() {
        var waypointExporter = new MockWaypoint();
        var waypointImporter = new Waypoint();

        waypointImporter.import(waypointExporter.export());

        expect(waypointImporter.getLatLon()).toEqual(waypointExporter.getLatLon());

        // Compare all object properties
        expect(waypointImporter).toMatchWaypoint(waypointExporter);
      });

      it('should accept an exported Waypoint as a constructor param', function() {
        var waypointExporter = new MockWaypoint();
        var mockJSON = waypointExporter.toJSON();
        var waypointImporter = new Waypoint(mockJSON);

        // Compare all object properties
        expect(waypointImporter).toMatchWaypoint(waypointExporter);
      });
    });
  });
});
