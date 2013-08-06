define([
  'aeris',
  'jasmine',
  'testErrors/untestedspecerror',
  'gmaps/route/waypoint',
  'mocks/waypoint',
  'mocks/directionsresults',
  'vendor/underscore',
  'aeris/utils',
  'testUtils',
  'gmaps/utils'
], function(
  aeris,
  jasmine,
  UntestedSpecError,
  Waypoint,
  MockWaypoint,
  MockDirectionsResults,
  _,
  utils,
  testUtils,
  mapUtils
) {
  describe('A Waypoint', function() {

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
      expect(wp.followDirections).toEqual(true);
      expect(wp.travelMode).toBe('WALKING');
      expect(wp.getDistance()).toEqual(0);
    });

    it('should have a unique client id, prefixed with \'wp_\'', function() {
      var wp;

      spyOn(aeris.utils, 'uniqueId').andCallThrough();
      wp = new Waypoint();

      expect(wp.cid).toBeDefined();
      expect(aeris.utils.uniqueId).toHaveBeenCalled();
      expect(wp.cid).toMatch(/^wp_[0-9]*/);
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

    describe('Should trigger events', function() {
      it('should trigger a change:distance event', function() {
        var wp = new MockWaypoint();
        var triggered = false;

        wp.on('change:distance', function() {
          triggered = true;
        });

        wp.setDistance(1921235456245123);
        expect(triggered).toEqual(true);
      });
    });

    describe('JSON import/export', function() {
      it('export as a JSON string', function() {
        var wp = new Waypoint({
          originalLatLon: [-45, 90],
          geocodedLatLon: [-45.1, 90.1],
          followDirections: true,
          travelMode: 'WALKING',
          path: ['mock', 'path']
        });

        expect(wp.export()).toEqual('{' +
          '"originalLatLon":[-45,90],' +
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
        wp.followDirections = false;
        wp.travelMode = 'JETPACK';

        json = {'originalLatLon': [44.972752843480855, -93.27199459075928], 'geocodedLatLon': [44.97276, -93.272], "followDirections": true, 'travelMode': 'WALKING', 'path': [[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]], 'distance': 1153};

        wp.reset(json);

        expect(wp.getDistance()).toEqual(1153);
        expect(wp.followDirections).toEqual(true);
        expect(wp.travelMode).toEqual('WALKING');
        expect(wp.originalLatLon).toEqual([44.972752843480855, -93.27199459075928]);
        expect(wp.geocodedLatLon).toEqual([44.97276, -93.272]);
        expect(wp.path).toEqual([[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]]);
      });

      it('should import waypoint data from a JSON string', function() {
        var jsonStr = '{' +
          '"originalLatLon":[44.97840714423616,-93.2635509967804],' +
          '"geocodedLatLon":[44.978410000000004,-93.26356000000001],' +
          '"followDirections":true,' +
          '"travelMode":"WALKING",' +
          '"path":[[44.97905,-93.26302000000001],[44.978410000000004,-93.26356000000001]],' +
          '"distance":83' +
        '}';

        var wp = new Waypoint();
        wp.import(jsonStr);

        expect(wp.originalLatLon).toEqual([44.97840714423616, -93.2635509967804]);
        expect(wp.geocodedLatLon).toEqual([44.978410000000004, -93.26356000000001]);
        expect(wp.followDirections).toEqual(true);
        expect(wp.travelMode).toEqual('WALKING');
        expect(wp.path).toEqual([[44.97905, -93.26302000000001], [44.978410000000004, -93.26356000000001]]);
        expect(wp.getDistance()).toEqual(83);
      });

      it('should reject poorly formed JSON object input', function() {
        var wp = new Waypoint();

        var goodJSON = {'originalLatLon': [44.972752843480855, -93.27199459075928], 'geocodedLatLon': [44.97276, -93.272], "followDirections": true, 'travelMode': 'WALKING', 'path': [[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]], 'distance': 1153};
        var badJSONs = [
          _.extend({}, goodJSON, { distance: 'way out there' }),
          _.extend({}, goodJSON, { originalLatLon: ['this far north', 'this far west']}),
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

          expect(fn).toThrowType('JSONParseError');
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

    describe('Calculate path data', function() {
      var latLon_origin, latLon_destination, 
          waypoint_origin, waypoint_destination;
      
      beforeEach(function() {
        latLon_origin = testUtils.getRandomLatLon();
        latLon_destination = testUtils.getRandomLatLon();
        waypoint_origin = new Waypoint();
        waypoint_destination = new Waypoint();

        spyOn(waypoint_origin, 'getLatLon').andReturn(latLon_origin);
        spyOn(waypoint_destination, 'getLatLon').andReturn(latLon_destination);
      });


      it('should calculate the direct distance to another waypoint', function () {
        var mockDistance = 12345;
        var result;

        spyOn(google.maps.geometry.spherical, 'computeDistanceBetween').andCallFake(
          function(from, to) {
            expect(from).toEqual(mapUtils.arrayToLatLng(latLon_origin));
            expect(to).toEqual(mapUtils.arrayToLatLng(latLon_destination));

            return mockDistance;
          }
        );

        result = waypoint_origin.calculateDirectDistanceTo(waypoint_destination);
        expect(result).toEqual(mockDistance);
      });

      it('should fetch path info to another waypoint', function () {
        var mockDistance = 12345;
        var mockPath = [
            testUtils.getRandomLatLon(),
            testUtils.getRandomLatLon(),
            testUtils.getRandomLatLon()
        ];

        // Mock Google Directions Service
        var directionsService = {
          route: function(request, callback) {
            // Test: correct request parameters
            expect(request).toEqual({
              origin: mapUtils.arrayToLatLng(latLon_origin),
              destination: mapUtils.arrayToLatLng(latLon_destination),
              travelMode: google.maps.TravelMode[waypoint_destination.travelMode]
            });

            callback(new MockDirectionsResults({
              path: mockPath,
              distance: mockDistance
            }), google.maps.DirectionsStatus.OK);
          }
        };

        waypoint_origin.fetchPathTo(waypoint_destination, directionsService).
            done(function(path, distance) {
              expect(path).toBeNearPath(mockPath);
              expect(distance).toEqual(mockDistance);
              testUtils.setFlag();
            });

        waitsFor(testUtils.checkFlag, 'fetchPathTo to resolve', 50);
      });
    });
  });
});
