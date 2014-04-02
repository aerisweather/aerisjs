define([
  'aeris/util',
  'aeris/promise',
  'aeris/maps/routes/waypoint',
  'aeris/errors/validationerror',
  'aeris/collection',
  'mocks/mapobject',
  'mocks/waypoint',
  'mocks/aeris/directions/directionsservice',
  'matchers/route-matchers'
], function(
  _,
  Promise,
  Waypoint,
  ValidationError,
  Collection,
  MockMapObject,
  MockWaypoint,
  MockDirectionsService
) {

  var MockPolyline = function() {
    var stubbedMethods = [
      'setStyles'
    ];
    MockMapObject.apply(this, arguments);

    _.extend(this, jasmine.createSpyObj('mockPolyline', stubbedMethods));
  };
  _.inherits(MockPolyline, MockMapObject);


  var MockPolylineValidationError = function(message) {
    this.name = 'MockPolylineValidationError';
    this.message = message;
  };


  var MockRoute = function() {
    var stubbedMethods = [
      'getNext',
      'getPrevious'
    ];

    Collection.apply(this, arguments);

    _.extend(this, jasmine.createSpyObj('mockRoute', stubbedMethods));
  };
  _.inherits(MockRoute, Collection);



  describe('A Waypoint', function() {

    beforeEach(function() {
      spyOn(Waypoint.prototype, 'setStrategy_');
      spyOn(Waypoint.prototype, 'loadStrategy_').andReturn(new Promise());
    });

    afterEach(function() {
      Waypoint.prototype.setStrategy_.andCallThrough();
      Waypoint.prototype.loadStrategy_.andCallThrough();
    });



    describe('constructor', function() {

      beforeEach(function() {
        // Stub out validation
        spyOn(Waypoint.prototype, 'validate');
      });

      afterEach(function() {
        // Restore validation
        Waypoint.prototype.validate.andCallThrough();
      });

      it('should set default attributes', function() {
        var wp = new Waypoint(null, { polyline: new MockPolyline() });

        // Some defaults
        expect(wp.get('path')).toEqual([]);
        expect(wp.get('followDirections')).toEqual(true);
        expect(wp.get('travelMode')).toBe(Waypoint.travelMode.WALKING);
        expect(wp.getDistance()).toEqual(0);
      });


      describe('Its Polyline', function() {
        var polyline;

        beforeEach(function() {
          polyline = new MockPolyline();
        });


        it('should set it\'s path on it\'s polyline', function() {
          new Waypoint({
            path: [[12, 34], [56, 78]]
          }, {
            polyline: polyline
          });

          expect(polyline.get('path')).toEqual([[12, 34], [56, 78]]);
        });

        it('should set the polyline\'s map to it\'s map', function() {
          new Waypoint({
            map: { some: 'map' }
          }, {
            polyline: polyline
          });

          expect(polyline.get('map')).toEqual({ some: 'map' });
        });
      });

    });


    describe('Polyline attribute bindings', function() {
      var polyline, waypoint;

      beforeEach(function() {
        polyline = new MockPolyline();
        waypoint = new Waypoint(null, {
          polyline: polyline
        });

        // Stub out validation
        spyOn(waypoint, 'validate').andReturn(void 0);
      });

      afterEach(function() {
        // Restore validation
        waypoint.validate.andCallThrough();
      });



      it('should update the polyline\'s map, when it\'s own map changes', function() {
        waypoint.set('map', { some: 'map' });

        expect(polyline.get('map')).toEqual({ some: 'map' });
      });

      it('should update the polyline\'s path, when it\'s own path changes', function() {
        waypoint.set('path', [[12, 34], [56, 78]]);

        expect(polyline.get('path')).toEqual([[12, 34], [56, 78]]);
      });

      it('should update the polyline\'s path when the waypoint is reset', function() {
        waypoint.reset({
          path: [[12, 34], [56, 78]]
        });

        expect(polyline.get('path')).toEqual([[12, 34], [56, 78]]);
      });

      it('should validate when setting polyline attributes', function() {
        polyline.validate = function(attrs) {
          if (attrs.map === 'uglyMap') {
            throw new MockPolylineValidationError('Yo map so ugly, a MapObjectInterace would throw an error.');
          }
          if (attrs.path === null) {
            throw MockPolylineValidationError('A journey of 1000 miles begins with a single LatLon coordinate.');
          }
        };

        expect(function() {
          waypoint.set('map', 'uglyMap');
        }).toThrowType('MockPolylineValidationError');

        expect(function() {
          waypoint.set('path', null);
        }).toThrowType('MockPolylineValidationError');
      });

    });


    describe('Events', function() {
      var waypoint, polyline;

      beforeEach(function() {
        polyline = new MockPolyline();
        waypoint = new Waypoint(null, { polyline: polyline });
      });


      describe('path:click', function() {
        var onPathClick;

        beforeEach(function() {
          onPathClick = jasmine.createSpy('onPathClick');
          waypoint.on('path:click', onPathClick);
        });


        it('should be triggered when its Polyline triggers a click event', function() {
          polyline.trigger('click', [12, 34]);
          expect(onPathClick).toHaveBeenCalled();
        });

        it('should provide the latLon and the waypoint as event parameters', function() {
          polyline.trigger('click', [12, 34]);
          expect(onPathClick).toHaveBeenCalledWith([12, 34], waypoint);
        });

      });

    });


    describe('validate', function() {
      var waypoint, pathValidator = {};

      beforeEach(function() {

        pathValidator.setPath = jasmine.createSpy('setPath');

        pathValidator.isValid = jasmine.createSpy('isValid').
          andReturn(true);

        pathValidator.getLastError = jasmine.createSpy('getLastError').
          andReturn(new Error('MockPathValidatorError'));

        waypoint = new Waypoint(null, {
          polyline: new MockPolyline(),
          pathValidator: pathValidator
        });
      });

      describe('distance', function() {

        it('should require a positive number', function() {
          expect(function() {
            waypoint.set('distance', -83, { validate: true });
          }).toThrowType(ValidationError);

          waypoint.set('distance', 38);
        });

      });

      describe('path', function() {
        var PATH_STUB = 'mock path';


        it('should validate a valid path', function() {
          pathValidator.isValid.andReturn(true);

          // Should not throw error
          waypoint.set('path', PATH_STUB, { validate: true });
          expect(pathValidator.setPath).toHaveBeenCalledWith(PATH_STUB);
        });

        it('should invalidate an invalid path', function() {
          pathValidator.isValid.andReturn(false);

          expect(function() {
            waypoint.set('path', PATH_STUB, { validate: true });
          }).toThrow('MockPathValidatorError');

          expect(pathValidator.setPath).toHaveBeenCalledWith(PATH_STUB);
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
            }).toThrowType(ValidationError);
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
          }).toThrowType(ValidationError);
        });

      });

    });


    describe('getPosition', function() {
      it('should return the most accurate lat/lon', function() {
        var wp = new Waypoint({
          position: [-45, 90]
        }, { polyline: new MockPolyline() });

        expect(wp.getPosition()).toEqual([-45, 90]);
      });
    });


    describe('hasPath', function() {

      it('should return true if a path is defined', function() {
        var waypoint = new Waypoint({
          path: [[12, 34], [56, 78]]
        }, { polyline: new MockPolyline() });

        expect(waypoint.hasPath()).toEqual(true);
      });

      it('should return false if not path is defined', function() {
        var waypoint = new Waypoint({
          path: []
        }, { polyline: new MockPolyline() });

        expect(waypoint.hasPath()).toEqual(false);
      });

    });


    describe('getRoute', function() {

      it('should return the waypoint\'s route', function() {
        var waypoint = new Waypoint(null, { polyline: new MockPolyline() });
        var route = new Collection([waypoint]);

        expect(waypoint.getRoute()).toEqual(route);
      });

      it('should return undefined if the waypoint does not belong to a route', function() {
        var waypoint = new Waypoint(null, { polyline: new MockPolyline() });

        expect(waypoint.getRoute()).toEqual(undefined);
      });

      it('should return undefined after a waypoint is removed from a route', function() {
        var waypoint = new Waypoint(null, { polyline: new MockPolyline() });
        var route = new Collection([waypoint]);

        route.remove(waypoint);

        expect(waypoint.getRoute()).toEqual(undefined);
      });

      // See https://github.com/jashkenas/backbone/issues/2929
      it('should return undefined in a `remove` event handler', function() {
        var waypoint = new Waypoint(null, { polyline: new MockPolyline() });
        var route = new Collection([waypoint]);
        var onRemove = jasmine.createSpy('onRemove');

        onRemove.andCallFake(function() {
          expect(waypoint.getRoute()).toEqual(undefined);
        });

        waypoint.on('remove', onRemove);

        route.remove(waypoint);

        expect(onRemove).toHaveBeenCalled();
      });

    });


    describe('getNextInRoute', function() {
      var route;
      var waypoint;

      beforeEach(function() {
        route = new MockRoute();
        waypoint = new Waypoint;
      });


      it('should return the next waypoint in the route', function() {
        var nextWaypoint = new Waypoint();
        route.add([waypoint, nextWaypoint]);
        route.getNext.andReturn(nextWaypoint);

        expect(waypoint.getNextInRoute()).toEqual(nextWaypoint);
      });

      it('should return undefined if the waypoint is the last in the route', function() {
        var prevWaypoint = new Waypoint();
        route.add([prevWaypoint, waypoint]);
        route.getNext.andReturn(undefined);

        expect(waypoint.getNextInRoute()).toEqual(undefined);
      });

      it('should throw an error if the waypoint is not in a route', function() {
        expect(function() {
          waypoint.getNextInRoute();
        }).toThrowType('WaypointNotInRouteError');
      });

    });


    describe('getPreviousInRoute', function() {
      var route;
      var waypoint;

      beforeEach(function() {
        route = new MockRoute();
        waypoint = new Waypoint;
      });


      it('should return the previous waypoint in the route', function() {
        var prevWaypoint = new Waypoint();
        route.add([prevWaypoint, waypoint]);
        route.getPrevious.andReturn(prevWaypoint);

        expect(waypoint.getPreviousInRoute()).toEqual(prevWaypoint);
      });

      it('should return undefined if the waypoint is the first in the route', function() {
        var nextWaypoint = new Waypoint();
        route.add([waypoint, nextWaypoint]);
        route.getPrevious.andReturn(undefined);

        expect(waypoint.getPreviousInRoute()).toEqual(undefined);
      });

      it('should throw an error if the waypoint is not in a route', function() {
        expect(function() {
          waypoint.getPreviousInRoute();
        }).toThrowType('WaypointNotInRouteError');
      });

    });


    describe('export', function() {
      it('export as a JSON string', function() {
        var wp = new Waypoint({
          position: [-45, 90],
          followDirections: true,
          travelMode: Waypoint.travelMode.WALKING,
          path: [[12, 34], [56, 78]]
        }, { polyline: new MockPolyline() });

        expect(wp.export()).toEqual('{' +
          '"position":[-45,90],' +
          '"followDirections":true,' +
          '"travelMode":"WALKING",' +
          '"path":[[12,34],[56,78]],' +
          '"distance":0' +
        '}');
      });
    });


    describe('reset', function() {

      it('should reset waypoint data from a JSON object', function() {
        // Taken from example export
        var wp, json;
        wp = new Waypoint(null, { polyline: new MockPolyline() });

        // Set non-standard options,
        // so we can detect changed=s
        wp.set('followDirections', false);
        wp.set('travelMode', 'JETPACK');

        json = {'position': [44.972752843480855, -93.27199459075928], 'followDirections': true, 'travelMode': 'WALKING', 'path': [[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]], 'distance': 1153};

        wp.reset(json);

        expect(wp.getDistance()).toEqual(1153);
        expect(wp.get('followDirections')).toEqual(true);
        expect(wp.get('travelMode')).toEqual(Waypoint.travelMode.WALKING);
        expect(wp.get('position')).toEqual([44.972752843480855, -93.27199459075928]);
        expect(wp.get('path')).toEqual([[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]]);
      });

      it('should reject poorly formed JSON object input', function() {
        var wp = new Waypoint(null, { polyline: new MockPolyline() });

        var goodJSON = {'position': [44.972752843480855, -93.27199459075928], 'followDirections': true, 'travelMode': 'WALKING', 'path': [[44.978350000000006, -93.26335], [44.979310000000005, -93.26556000000001], [44.979350000000004, -93.26569], [44.97887, -93.26608], [44.979110000000006, -93.26667], [44.978060000000006, -93.26758000000001], [44.97672, -93.26873], [44.97574, -93.26950000000001], [44.97478, -93.27031000000001], [44.97415, -93.27086000000001], [44.97316000000001, -93.27170000000001], [44.97276, -93.272]], 'distance': 1153};
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

          expect(fn).toThrowType(ValidationError);
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

        var wp = new Waypoint(null, { polyline: new MockPolyline() });
        wp.import(jsonStr);

        expect(wp.get('position')).toEqual([44.97840714423616, -93.2635509967804]);
        expect(wp.get('followDirections')).toEqual(true);
        expect(wp.get('travelMode')).toEqual(Waypoint.travelMode.WALKING);
        expect(wp.get('path')).toEqual([[44.97905, -93.26302000000001], [44.978410000000004, -93.26356000000001]]);
        expect(wp.getDistance()).toEqual(83);
      });

      it('should reject poorly formed JSON string input', function() {
        var wp = new Waypoint(null, { polyline: new MockPolyline() });

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
        var waypointImporter = new Waypoint(null, { polyline: new MockPolyline() });

        waypointImporter.import(waypointExporter.export());

        expect(waypointImporter.getPosition()).toEqual(waypointExporter.getPosition());

        // Compare all object properties
        expect(waypointImporter).toMatchWaypoint(waypointExporter);
      });

      it('should accept an exported Waypoint as a constructor param', function() {
        var waypointExporter = new MockWaypoint();
        var mockJSON = waypointExporter.toJSON();
        var waypointImporter = new Waypoint(mockJSON, { polyline: new MockPolyline() });

        // Compare all object properties
        expect(waypointImporter).toMatchWaypoint(waypointExporter);
      });

    });


    describe('stylePath', function() {
      var waypoint, polyline;

      beforeEach(function() {
        polyline = new MockPolyline();
        waypoint = new Waypoint(null, {
          polyline: polyline
        });
      });


      it('should set styles on its polyline', function() {
        waypoint.stylePath({
          strokeColor: 'blue'
        });
        expect(polyline.setStyles).toHaveBeenCalledWith({
          strokeColor: 'blue'
        });
      });

    });


    describe('setPathStartsAt', function() {
      var mockDirectionsService, mockNonstopDirectionsService;
      var waypoint;
      var STUB_WAYPOINT_POSITION, STUB_START_AT, STUB_TRAVEL_MODE;
      var STUB_RESULTS, STUB_RESULTS_PATH, STUB_RESULTS_DISTANCE, STUB_RESULTS_STATUS;

      function populateStubs() {
        STUB_WAYPOINT_POSITION = [56, 78];
        STUB_START_AT = [12, 34];
        STUB_TRAVEL_MODE = 'STUB_TRAVEL_MODE';

        populateDirectionsResultsStub();
      }

      function populateDirectionsResultsStub() {
        STUB_RESULTS_PATH = [
          [12, 34],
          [56, 78],
          [90, 12]
        ];
        STUB_RESULTS_DISTANCE = 1234.5678;
        STUB_RESULTS_STATUS = { foo: 'bar' };
        STUB_RESULTS = {
          path: STUB_RESULTS_PATH,
          distance: STUB_RESULTS_DISTANCE,
          status: STUB_RESULTS_STATUS
        };
      }

      beforeEach(function() {
        populateStubs();

        mockDirectionsService = new MockDirectionsService();
        mockNonstopDirectionsService = new MockDirectionsService();

        waypoint = new Waypoint({
          position: STUB_WAYPOINT_POSITION,
          followDirections: true,
          travelMode: STUB_TRAVEL_MODE
        }, {
          directionsService: mockDirectionsService,
          nonstopDirectionsService: mockNonstopDirectionsService
        });
      });

      it('should use the directionsService if followDirections is true', function() {
        waypoint.set('followDirections', true);

        waypoint.setPathStartsAt(STUB_START_AT);

        expect(mockDirectionsService.fetchPath).toHaveBeenCalled();
      });

      it('should use the nonstopDirectionsService if followDirections is false', function() {
        waypoint.set('followDirections', false);

        waypoint.setPathStartsAt(STUB_START_AT);

        expect(mockNonstopDirectionsService.fetchPath).toHaveBeenCalled();
      });

      it('should get directions from the specified \'startsAt\' latLon', function() {
        waypoint.setPathStartsAt(STUB_START_AT);

        mockDirectionsService.shouldHaveFetchedPathFrom(STUB_START_AT);
      });

      it('should get directions to the waypoint\'s position', function() {
        waypoint.setPathStartsAt(STUB_START_AT);

        mockDirectionsService.shouldHaveFetchedPathTo(STUB_WAYPOINT_POSITION);
      });

      it('should get directions using the waypoint\'s travel mode', function() {
        waypoint.setPathStartsAt(STUB_START_AT);

        mockDirectionsService.shouldHaveFetchedPathWithTravelMode(STUB_TRAVEL_MODE);
      });

      it('should trigger a \'directions:request\' event', function() {
        var onDirectionsRequest = jasmine.createSpy('onDirectionsRequest');
        waypoint.on('directions:request', onDirectionsRequest);

        waypoint.setPathStartsAt();

        expect(onDirectionsRequest).toHaveBeenCalledWith(waypoint);
      });


      describe('if the directions service succeeds', function() {
        var onDirectionsComplete;

        beforeEach(function() {
          onDirectionsComplete = jasmine.createSpy('onDirectionsComplete');
          waypoint.on('directions:complete', onDirectionsComplete);

          waypoint.setPathStartsAt(STUB_START_AT);
          mockDirectionsService.resolveFetchPathWith(STUB_RESULTS);

        });


        it('should update the waypoint\'s path to the directions results path', function() {
          expect(waypoint.get('path')).toEqual(STUB_RESULTS_PATH);
        });

        it('should update the waypoint\'s position to the last latLon in the results path', function() {
          var lastLatLonInPath = STUB_RESULTS_PATH[STUB_RESULTS_PATH.length - 1];

          expect(waypoint.get('position')).toEqual(lastLatLonInPath);
        });

        it('should update the waypoint\'s distance to the directions results distance', function() {
          expect(waypoint.get('distance')).toEqual(STUB_RESULTS_DISTANCE);
        });

        it('should trigger a \'directions:complete\' event', function() {
          expect(onDirectionsComplete).toHaveBeenCalledWith(waypoint);
        });
      });


      describe('if the directions service fails', function() {
        var onDirectionsError;

        beforeEach(function() {
          onDirectionsError = jasmine.createSpy('onDirectionsError');
          waypoint.on('directions:error', onDirectionsError);

          waypoint.setPathStartsAt(STUB_START_AT);
          mockDirectionsService.rejectFetchPathWith(STUB_RESULTS);
        });


        it('should trigger a \'directions:error\' event', function() {
          expect(onDirectionsError).toHaveBeenCalled();
        });

        it('should trigger only one \'directions:error\' event', function() {
          expect(onDirectionsError.callCount).toEqual(1);
        });

        it('should include the directions results with the \'directions:error\' event', function() {
          expect(onDirectionsError).toHaveBeenCalledWith(waypoint, STUB_RESULTS);
        });

      });

    });
  });
});
