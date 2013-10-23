define([
  'aeris/util',
  'aeris/events',
  'sinon',
  'gmaps/route/routerenderer',
  'base/marker',
  'base/map',
  'gmaps/route/route',
  'gmaps/route/waypoint',
  'gmaps/utils'
], function(_, Events, sinon, RouteRenderer, Marker, Map, Route, Waypoint, mapUtil) {

  var TestFactory = function() {
    var polyline = new MockPolylineFactory();
    var marker = new MockMarkerFactory();

    this.Polyline = polyline.ctor;
    this.polyline = polyline.instance;
    this.Marker = marker.ctor;
    this.marker = marker.instance;

    this.renderer = this.rR = new RouteRenderer({
      Marker: this.Marker,
      Polyline: this.Polyline
    });
  };

  /**
   * @return {Function} Mock Polyline constructor.
   * @constructor
   */
  var MockPolylineFactory = function() {
    var polyline = {};

    var MockPolyline = jasmine.createSpy('Polyline Ctor').andCallFake(function() {
      return _.extend(polyline, this);
    });
    _.inherits(MockPolyline, google.maps.Polyline);

    _.extend(MockPolyline.prototype,
      sinon.createStubInstance(google.maps.Polyline),
      jasmine.createSpyObj('MockPolyline', [
        'setMap'
      ])
    );

    return {
      ctor: MockPolyline,
      instance: polyline
    };
  };

  /**
   * @return {Function} Mock Marker constructor.
   * @constructor
   */
  var MockMarkerFactory = function() {
    var marker = {};

    // Mixin events
    _.extend(marker, Events);
    Events.call(marker);

    var MockMarker = jasmine.createSpy('Marker Ctor').andCallFake(function() {
      return _.extend(marker, this);
    });
    _.inherits(MockMarker, Marker);

    _.extend(MockMarker.prototype, sinon.createStubInstance(Marker), jasmine.createSpyObj('MockMarker', [
      'setMap'
    ]));

    return {
      ctor: MockMarker,
      instance: marker
    };
  };


  var MockRoute = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      waypoints: []
    });

    _.extend(this, sinon.createStubInstance(Route),
      jasmine.createSpyObj('MockRoute', [
        'has',
        'getWaypoints'
      ]));

    this.has.andCallFake(function(wp) {
      return options.waypoints.indexOf(wp) !== -1;
    });

    this.getWaypoints.andReturn(options.waypoints);

    this.cid = _.uniqueId('mockRoute_');
  };
  _.inherits(MockRoute, Route);


  var MockWaypoint = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
    });

    _.extend(this, sinon.createStubInstance(Waypoint),
      jasmine.createSpyObj('Waypoint', [
        'getLatLon',
        'isSelected'
      ])
    );

    this.cid = _.uniqueId('mockwp_');

    this.path = options.path;
  };
  _.inherits(MockWaypoint, Waypoint);


  var MockMap = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      view: { foo: 'bar' }
    });

    this.getView.andReturn(options.view);

    _.extend(this, sinon.createStubInstance(Map));
  };
  _.inherits(MockMap, Map);
  _.extend(MockMap.prototype, jasmine.createSpyObj('MockMap', [
    'getView'
  ]));


  describe('A RouteRenderer', function() {


    beforeEach(function() {
      spyOn(mapUtil, 'pathToLatLng').andCallFake(function(path) {
        return path;
      });
    });


    describe('constructor', function() {

      it('should set a map', function() {
        var mockMap = new MockMap();

        spyOn(RouteRenderer.prototype, 'setMap');
        new RouteRenderer({ map: mockMap });

        expect(RouteRenderer.prototype.setMap).toHaveBeenCalledWith(mockMap);
      });

    });

    describe('renderWaypoint', function() {

      beforeEach(function() {
        // Stub out methods called by renderWaypoint
        _.each(['redrawWaypoint', 'renderPath', 'renderMarker', 'proxyEvents'], function(method) {
          spyOn(RouteRenderer.prototype, method);
        }, this);
      });

      it('should require a waypoint', function() {
        var rR = new TestFactory().renderer;
        var route = new MockRoute();
        route.has.andReturn(true);

        expect(function() {
          rR.renderWaypoint({ foo: 'bar' }, route);
        }).toThrowType('InvalidArgumentError');
      });

      it('should require a route', function() {
        var rR = new TestFactory().renderer;
        var waypoint = new MockWaypoint();

        expect(function() {
          rR.renderWaypoint(waypoint, { foo: 'bar' });
        }).toThrowType('InvalidArgumentError');
      });

      it('should require the waypoint to belong to the route', function() {
        var rR = new TestFactory().renderer;
        var waypoint = new MockWaypoint();
        var route = new MockRoute();

        route.has.andReturn(false);

        expect(function() {
          rR.renderWaypoint(waypoint, route);
        }).toThrowType('InvalidArgumentError');


        // Normal behavior
        route.has.andCallFake(function(wp) {
          return wp === waypoint;
        });
        rR.renderWaypoint(waypoint, route);
      });

      it('should render the waypoint\'s path', function() {
        var rR = new TestFactory().renderer;
        var waypoint = new MockWaypoint();
        var route = new MockRoute({ waypoints: [waypoint] });

        waypoint.path = ['foo'];

        rR.renderWaypoint(waypoint, route);

        expect(rR.renderPath).toHaveBeenCalledWithSomeOf(waypoint.path);
      });

      it('should render a marker at the waypoint\'s position', function() {
        var rR = new TestFactory().renderer;
        var waypoint = new MockWaypoint();
        var route = new MockRoute({ waypoints: [waypoint] });
        var latLon = [45, -90];

        waypoint.getLatLon.andReturn(latLon);

        rR.renderWaypoint(waypoint, route);

        expect(rR.renderMarker).toHaveBeenCalledWithSomeOf(latLon);
      });

      it('should proxy events for the rendered marker', function() {
        var rR = new TestFactory().renderer;
        var waypoint = new MockWaypoint();
        var route = new MockRoute({ waypoints: [waypoint] });
        var marker = { foo: 'bar' };

        rR.renderMarker.andReturn(marker);

        rR.renderWaypoint(waypoint, route);

        expect(rR.proxyEvents).toHaveBeenCalledWithSomeOf(marker);
      });

      it('should redraw existing waypoints', function() {
        var rR = new TestFactory().renderer;
        var waypoint = new MockWaypoint();
        var route = new MockRoute({ waypoints: [waypoint]});

        rR.renderWaypoint(waypoint, route);
        rR.renderWaypoint(waypoint, route);

        expect(rR.redrawWaypoint).toHaveBeenCalledWith(waypoint, route);
        expect(rR.redrawWaypoint.callCount).toEqual(1);
      });
    });


    describe('renderRoute', function() {

      beforeEach(function() {
        spyOn(RouteRenderer.prototype, 'renderWaypoint');
      });

      it('should render all waypoints in a route', function() {
        var rR = new TestFactory().renderer;
        var waypoints = [
          new MockWaypoint(),
          new MockWaypoint()
        ];
        var route = new MockRoute({ waypoints: waypoints });

        rR.renderRoute(route);

        expect(rR.renderWaypoint).toHaveBeenCalledWith(waypoints[0], route);
        expect(rR.renderWaypoint).toHaveBeenCalledWith(waypoints[1], route);
        expect(rR.renderWaypoint.callCount).toEqual(waypoints.length);
      });

    });


    describe('renderPath', function() {

      it('should create a polyline', function() {
        var test = new TestFactory();
        var path = ['a', 'b', 'c'];

        test.rR.renderPath(path);

        expect(test.Polyline.argsForCall[0][0].path).toEqual(path);
      });

      it('should set the polyline to the map, if one is available', function() {
        var test = new TestFactory();
        var path = ['a', 'b', 'c'];

        spyOn(test.rR, 'hasMap').andReturn(true);
        test.rR.setMap(new MockMap());

        test.rR.renderPath(path);

        expect(test.polyline.setMap).toHaveBeenCalled();
      });

      it('should return the polyline', function() {
        var test = new TestFactory();
        var path = ['a', 'b', 'c'];

        expect(test.rR.renderPath(path)).toEqual(test.polyline);
      });

    });


    describe('renderMarker', function() {

      it('should create a marker at the specified lat lon', function() {
        var test = new TestFactory();
        var latLon = [45, -90];

        test.rR.renderMarker(latLon);

        expect(test.Marker).toHaveBeenCalled();
        expect(test.Marker.argsForCall[0][0].position).toEqual(latLon);
      });

      it('should set the marker to the map', function() {
        var test = new TestFactory();
        var latLon = [45, -90];
        var map = new MockMap();

        test.rR.setMap(map);

        test.rR.renderMarker(latLon);

        expect(test.marker.setMap).toHaveBeenCalledWith(map);
      });

      it('should return the marker', function() {
        var test = new TestFactory();
        var latLon = [45, -90];

        expect(test.rR.renderMarker(latLon)).toEqual(test.marker);
      });

    });


    describe('eraseAllRoutes', function() {

      beforeEach(function() {
        spyOn(RouteRenderer.prototype, 'eraseRoute');
      });

      it('should erase all rendered routes', function() {
        var test = new TestFactory();
        var waypoints = [new MockWaypoint(), new MockWaypoint()];
        var routes = [
          new MockRoute({ waypoints: [waypoints[0]] }),
          new MockRoute({ waypoints: [waypoints[1]] })
        ];

        test.rR.renderWaypoint(waypoints[0], routes[0]);
        test.rR.renderWaypoint(waypoints[1], routes[1]);

        test.rR.eraseAllRoutes();

        expect(test.rR.eraseRoute).toHaveBeenCalledWith(routes[0].cid);
        expect(test.rR.eraseRoute).toHaveBeenCalledWith(routes[1].cid);
        expect(test.rR.eraseRoute.callCount).toEqual(2);
      });

    });

    describe('eraseRoute', function() {

      beforeEach(function() {
        spyOn(RouteRenderer.prototype, 'eraseWaypoint');
      });

      it('should erase all waypoints in the route', function() {
        var test = new TestFactory();
        var waypoints = [new MockWaypoint(), new MockWaypoint()];
        var route = new MockRoute({ waypoints: waypoints });

        test.rR.renderRoute(route);

        test.rR.eraseRoute(route);
        expect(test.rR.eraseWaypoint).toHaveBeenCalledWith(waypoints[0].cid, route.cid);
        expect(test.rR.eraseWaypoint).toHaveBeenCalledWith(waypoints[1].cid, route.cid);
        expect(test.rR.eraseWaypoint.callCount).toEqual(2);
      });

    });

    describe('eraseWaypoint', function() {
      var waypoint, route, test;

      beforeEach(function() {
        test = new TestFactory();
        waypoint = new MockWaypoint();
        route = new MockRoute({ waypoints: [waypoint] });

        waypoint.path = [[1, -1], [2, -2]];

        test.rR.renderWaypoint(waypoint, route);
      });

      it('should remove the waypoint\'s marker from the map', function() {
        test.rR.eraseWaypoint(waypoint, route);

        expect(test.marker.setMap).toHaveBeenCalledWith(null);
      });

      it('should erase the waypoint\'s path (google polyline)', function() {
        test.rR.eraseWaypoint(waypoint, route);

        expect(test.polyline.setMap).toHaveBeenCalledWith(null);
      });

      it('should clean up events', function() {
        spyOn(test.marker, 'removeProxy');
        spyOn(google.maps.event, 'clearInstanceListeners');

        test.rR.eraseWaypoint(waypoint, route);

        expect(test.marker.removeProxy).toHaveBeenCalled();
        expect(google.maps.event.clearInstanceListeners).toHaveBeenCalledWith(test.polyline);
      });
    });


    describe('setMap', function() {
      var waypointSets, routes, test, path;

      beforeEach(function() {
        test = new TestFactory();
        path = [[1, -1], [2, -2]];

        waypointSets = [
          [new MockWaypoint({ path: path }), new MockWaypoint({ path: path })],
          [new MockWaypoint({ path: path }), new MockWaypoint({ path: path })]
        ];

        routes = [
          new MockRoute({ waypoints: waypointSets[0] }),
          new MockRoute({ waypoints: waypointSets[1] })
        ];

        test.rR.renderRoute(routes[0]);
        test.rR.renderRoute(routes[1]);
      });


      it('should set rendered markers to the map', function() {
        var map = new MockMap();
        var baseCallCount = test.Marker.prototype.setMap.callCount;

        test.rR.setMap(map);

        expect(test.marker.setMap).toHaveBeenCalledWith(map);
        expect(test.Marker.prototype.setMap.callCount).toEqual(baseCallCount + 4);
      });

      it('should set rendered polylines to the map', function() {
        var map = new MockMap();
        var baseCallCount = test.Polyline.prototype.setMap.callCount;

        test.rR.setMap(map);

        expect(test.polyline.setMap).toHaveBeenCalledWith(map.getView());
        expect(test.Polyline.prototype.setMap.callCount).toEqual(baseCallCount + 4);
      });

      it('should remove markers from the map, if null', function() {
        var baseCallCount = test.Marker.prototype.setMap.callCount;

        test.rR.setMap(null);

        expect(test.marker.setMap).toHaveBeenCalledWith(null);
        expect(test.Marker.prototype.setMap.callCount).toEqual(baseCallCount + 4);
      });

      it('should remove polylines from the map, if null', function() {
        var baseCallCount = test.Polyline.prototype.setMap.callCount;

        test.rR.setMap(null);

        expect(test.polyline.setMap).toHaveBeenCalledWith(null);
        expect(test.Polyline.prototype.setMap.callCount).toEqual(baseCallCount + 4);
      });

    });

  });
});
