define([
  'aeris/util',
  'gmaps/route/waypoint',
  'mocks/waypoint'
], function(
  _,
  Waypoint,
  MockWaypoint
) {
  describe('A Waypoint', function() {


    describe('constructor', function() {

      it('should set default attributes', function() {
        var wp = new Waypoint();

        // Some defaults
        expect(wp.get('path')).toEqual([]);
        expect(wp.get('followDirections')).toEqual(true);
        expect(wp.get('travelMode')).toBe(Waypoint.travelMode.WALKING);
        expect(wp.getDistance()).toEqual(0);
      });

    });


    describe('validate', function() {
      var waypoint;

      beforeEach(function() {
        waypoint = new Waypoint();
      });

      describe('distance', function() {

        it('should require a positive number', function() {
          expect(function() {
            waypoint.set('distance', -83, { validate: true })
          }).toThrowType('ValidationError');

          waypoint.set('distance', 38);
        });

      });


      describe('followDirections', function() {

        it('should require a boolean', function() {
          var invalidValues = [
            'foo',
            undefined,
            null,
            -1,
            0
          ];

          _.each(invalidValues, function(value) {
            expect(function() {
              waypoint.set('followDirections', value, { validate: true });
            }).toThrowType('ValidationError');
          });

          // Should not throw error
          waypoint.set('followDirections', false, { validate: true });
          waypoint.set('followDirections', true, { validate: true });
        });

      });


      describe('travelMode', function() {

        it('should require a string', function() {
          expect(function() {
            waypoint.set('travelMode', {}, { validate: true });
          }).toThrowType('ValidationError');
        });

      });

    });


    describe('getPosition', function() {
      it('should return the most accurate lat/lon', function() {
        var wp = new Waypoint({
          position: [-45, 90]
        });

        expect(wp.getPosition()).toEqual([-45, 90]);
      });
    });


    describe('select', function() {

      it('should select a waypoint, without triggering eventse', function() {
        var waypoint = new Waypoint();
        var eventListener = jasmine.createSpy('\'select\' event listener');

        waypoint.on('select', eventListener);

        waypoint.select({ silent: true });
        expect(eventListener).not.toHaveBeenCalled();
      });

    });


    describe('toggleSelect', function() {

      it('should select a deselected waypiont', function() {
        var waypoint = new Waypoint({
          selected: false
        });

        waypoint.toggleSelect();

        expect(waypoint.get('selected')).toEqual(true);
      });

      it('should deselect a selected waypoint', function() {
        var waypoint = new Waypoint({
          selected: true
        });

        waypoint.toggleSelect();

        expect(waypoint.get('selected')).toEqual(false);
      });


      it('should toggle repeatedly', function() {
        var waypoint = new Waypoint({
          selected: true
        });

        waypoint.toggleSelect();
        expect(waypoint.get('selected')).toEqual(false);

        waypoint.toggleSelect();
        expect(waypoint.get('selected')).toEqual(true);

        waypoint.toggleSelect();
        expect(waypoint.get('selected')).toEqual(false);

        waypoint.toggleSelect();
        expect(waypoint.get('selected')).toEqual(true);
      });

    });


    describe('isSelected', function() {

      it('should tell you if the waypoint is selected', function() {
        var waypoint = new Waypoint();

        waypoint.set('selected', true);
        expect(waypoint.isSelected()).toEqual(true);

        waypoint.set('selected', false);
        expect(waypoint.isSelected()).toEqual(false);
      });

    });


    describe('export', function() {
      it('export as a JSON string', function() {
        var wp = new Waypoint({
          position: [-45, 90],
          followDirections: true,
          travelMode: Waypoint.travelMode.WALKING,
          path: ['mock', 'path']
        });

        expect(wp.export()).toEqual('{' +
          '"position":[-45,90],' +
          '"followDirections":true,' +
          '"travelMode":"WALKING",' +
          '"path":["mock","path"],' +
          '"distance":0' +
        '}');
      });
    });


    describe('reset', function() {

      it('should reset waypoint data from a JSON object', function() {
        // Taken from example export
        var wp, json;
        wp = new Waypoint();

        // Set non-standard options,
        // so we can detect changed=s
        wp.set('followDirections', false);
        wp.set('travelMode', 'JETPACK');

        json = {"position": [44.972752843480855, -93.27199459075928],  "followDirections": true, 'travelMode': 'WALKING', 'path': [[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]], 'distance': 1153};

        wp.reset(json);

        expect(wp.getDistance()).toEqual(1153);
        expect(wp.get('followDirections')).toEqual(true);
        expect(wp.get('travelMode')).toEqual(Waypoint.travelMode.WALKING);
        expect(wp.get('position')).toEqual([44.972752843480855, -93.27199459075928]);
        expect(wp.get('path')).toEqual([[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]]);
      });

      it('should reject poorly formed JSON object input', function() {
        var wp = new Waypoint();

        var goodJSON = {"position": [44.972752843480855, -93.27199459075928], "followDirections": true, 'travelMode': 'WALKING', 'path': [[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]], 'distance': 1153};
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

    });


    describe('import', function() {
      it('should import waypoint data from a JSON string', function() {
        var jsonStr = '{' +
          '"position":[44.97840714423616,-93.2635509967804],' +
          '"followDirections":true,' +
          '"travelMode":"WALKING",' +
          '"path":[[44.97905,-93.26302000000001],[44.978410000000004,-93.26356000000001]],' +
          '"distance":83' +
        '}';

        var wp = new Waypoint();
        wp.import(jsonStr);

        expect(wp.get('position')).toEqual([44.97840714423616, -93.2635509967804]);
        expect(wp.get('followDirections')).toEqual(true);
        expect(wp.get('travelMode')).toEqual('WALKING');
        expect(wp.get('path')).toEqual([[44.97905, -93.26302000000001], [44.978410000000004, -93.26356000000001]]);
        expect(wp.getDistance()).toEqual(83);
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
    });


    describe('Import / Export Integration', function() {

      it('should import what it exports, using JSON objects', function() {
        var waypointExporter = new MockWaypoint();
        var waypointImporter = new MockWaypoint();

        waypointImporter.reset(waypointExporter.toJSON());

        expect(waypointImporter.getPosition()).toEqual(waypointExporter.getPosition());

        // Compare all object properties
        expect(waypointImporter).toMatchWaypoint(waypointExporter);
      });

      it('should import what is exports, using JSON strings', function() {
        var waypointExporter = new MockWaypoint();
        var waypointImporter = new Waypoint();

        waypointImporter.import(waypointExporter.export());

        expect(waypointImporter.getPosition()).toEqual(waypointExporter.getPosition());

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
