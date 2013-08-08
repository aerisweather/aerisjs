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
        latLon: [-45, 90],
        geocodedLatLon: [-45.1, 90.1],
        path: ['mock', 'path']
      });

      // Defined properties
      expect(wp.latLon).toEqual([-45, 90]);
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

    it('should not be able to change the cid', function() {
      var waypoint = new Waypoint();

      expect(function() {
        waypoint.set({ cid: 'fakeId' });
      }).toThrowType('InvalidArgumentError');
    });

    it('should return the most accurate lat/lon', function() {
      var wp = new Waypoint({
        latLon: [-45, 90]
      });

      expect(wp.getLatLon()).toEqual([-45, 90]);

      // geocoded lat lon is considered more accurate, and preferred
      wp.geocodedLatLon = [-45.1, 90.1];
      expect(wp.getLatLon()).toEqual([-45.1, 90.1]);
    });

    it('should select a waypoint, and optionally trigger a \'select\' event', function() {
      var waypoint = new Waypoint();

      spyOn(waypoint, 'set');
      spyOn(waypoint, 'trigger');

      waypoint.select();

      expect(waypoint.set).toHaveBeenCalledWith({
        selected: true
      }, { trigger: true });

      waypoint.select({ trigger: false });
      expect(waypoint.set).toHaveBeenCalledWith({
        selected: true
      }, { trigger: false });
    });

    it('should deselect a waypoint, and optionally trigger a \'deselect\' event', function() {
      var waypoint = new Waypoint();

      spyOn(waypoint, 'set');
      spyOn(waypoint, 'trigger');

      waypoint.deselect();

      expect(waypoint.set).toHaveBeenCalledWith({
        selected: false
      }, { trigger: true });

      waypoint.deselect({ trigger: false });
      expect(waypoint.set).toHaveBeenCalledWith({
        selected: false
      }, { trigger: false });
    });

    it('should tell you if the waypoint is selected', function() {
      var waypoint = new Waypoint();

      waypoint.selected = true;
      expect(waypoint.isSelected()).toEqual(true);

      waypoint.selected = false;
      expect(waypoint.isSelected()).toEqual(false);
    });

    describe('should set attributes', function() {
      it('and trigger a \'select\' event', function() {
        var waypoint = new Waypoint();

        spyOn(waypoint, 'trigger');

        waypoint.set({ selected: true });
        expect(waypoint.trigger).toHaveBeenCalledWith('select', waypoint);
      });

      it('and trigger a \'deselect\' event', function() {
        var waypoint = new Waypoint();

        spyOn(waypoint, 'trigger');

        waypoint.set({ selected: false });
        expect(waypoint.trigger).toHaveBeenCalledWith('deselect', waypoint);
      });

      it('and trigger change:property events', function() {
        var wp = new Waypoint();
        var expectedCount = 0;
        var actualCount = 0;

        spyOn(wp, 'trigger');

        function stubAndVerify(property, value) {
          var setObj = {};

          wp.trigger.andCallFake(function(topic, waypoint) {
            // Ignore generic 'change' events
            if (topic === 'change') { return; }

            actualCount++;

          expect(topic).toEqual('change:' + property);
          expect(waypoint).toEqual(wp);
        });

        setObj[property] = value;
        wp.set(setObj);

        expectedCount++;
        expect(actualCount).toEqual(expectedCount);
      }

      // Run run run
      stubAndVerify('latLon', testUtils.getRandomLatLon());
      stubAndVerify('geocodedLatLon', testUtils.getRandomLatLon());
      stubAndVerify('followDirections', false);
      stubAndVerify('travelMode', 'JETSKI');
      stubAndVerify('path', testUtils.getRandomPath());
    });

    it('and trigger a single \'change\' event when properties are changed', function() {
      var wp = new Waypoint();
      var changeEventCount = 0;

      spyOn(wp, 'trigger').andCallFake(function(topic, waypoint) {
        if (topic === 'change') {
          changeEventCount++;
          expect(waypoint).toEqual(wp);
        }
      });

      wp.set({
        distance: 12345,
        latLon: testUtils.getRandomLatLon(),
        travelMode: 'SPACE_ELEVATOR'
      });

      expect(wp.trigger).toHaveBeenCalled();
      expect(changeEventCount).toEqual(1);
    });
  });

    describe('JSON import/export', function() {
      it('export as a JSON string', function() {
        var wp = new Waypoint({
          latLon: [-45, 90],
          geocodedLatLon: [-45.1, 90.1],
          followDirections: true,
          travelMode: 'WALKING',
          path: ['mock', 'path']
        });

        expect(wp.export()).toEqual('{' +
          '"latLon":[-45,90],' +
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

        json = {"latLon": [44.972752843480855, -93.27199459075928], 'geocodedLatLon': [44.97276, -93.272], "followDirections": true, 'travelMode': 'WALKING', 'path': [[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]], 'distance': 1153};

        wp.reset(json);

        expect(wp.getDistance()).toEqual(1153);
        expect(wp.followDirections).toEqual(true);
        expect(wp.travelMode).toEqual('WALKING');
        expect(wp.latLon).toEqual([44.972752843480855, -93.27199459075928]);
        expect(wp.geocodedLatLon).toEqual([44.97276, -93.272]);
        expect(wp.path).toEqual([[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]]);
      });

      it('should import waypoint data from a JSON string', function() {
        var jsonStr = '{' +
          '"latLon":[44.97840714423616,-93.2635509967804],' +
          '"geocodedLatLon":[44.978410000000004,-93.26356000000001],' +
          '"followDirections":true,' +
          '"travelMode":"WALKING",' +
          '"path":[[44.97905,-93.26302000000001],[44.978410000000004,-93.26356000000001]],' +
          '"distance":83' +
        '}';

        var wp = new Waypoint();
        wp.import(jsonStr);

        expect(wp.latLon).toEqual([44.97840714423616, -93.2635509967804]);
        expect(wp.geocodedLatLon).toEqual([44.978410000000004, -93.26356000000001]);
        expect(wp.followDirections).toEqual(true);
        expect(wp.travelMode).toEqual('WALKING');
        expect(wp.path).toEqual([[44.97905, -93.26302000000001], [44.978410000000004, -93.26356000000001]]);
        expect(wp.getDistance()).toEqual(83);
      });

      it('should reject poorly formed JSON object input', function() {
        var wp = new Waypoint();

        var goodJSON = {"latLon": [44.972752843480855, -93.27199459075928], 'geocodedLatLon': [44.97276, -93.272], "followDirections": true, 'travelMode': 'WALKING', 'path': [[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]], 'distance': 1153};
        var badJSONs = [
          _.extend({}, goodJSON, { distance: 'way out there' }),
          _.extend({}, goodJSON, { latLon: ['this far north', 'this far west']}),
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
  });
});
