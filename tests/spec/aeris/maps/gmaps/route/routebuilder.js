define([
  'aeris',
  'jasmine',
  'sinon',
  'jquery',
  'gmaps/route/route',
  'gmaps/route/routerenderer',
  'gmaps/route/routebuilder',
  'mocks/waypoint',
  'gmaps/map',
  'base/events/click'
], function(
    aeris,
    jasmine,
    sinon,
    $,
    Route,
    RouteRenderer,
    RouteBuilder,
    MockWaypoint,
    AerisMap,
    ClickEvent
) {
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
  });


  describe('A RouteBuilder', function() {
    it('should require an AerisMap', function() {
      expect(function() {
        new RouteBuilder(null);
      }).toThrowType('InvalidArgumentError');

      new RouteBuilder(map);
    });

    describe('Its Route', function() {

      it('should create a Route', function() {
        spyOn(aeris.maps.gmaps.route.Route.prototype, 'on');

        new RouteBuilder(map);
        // Testing indirectly, because of trouble with
        // Jasmine removing 'on' method when mocking
        // constructor.
        expect(aeris.maps.gmaps.route.Route.prototype.on).toHaveBeenCalled();
      });

      it('should return a route with getRoute()', function() {
        var builder = new RouteBuilder(map);

        expect(builder.getRoute() instanceof Route).toEqual(true);
      });

      it('should accept a Route', function() {
        var route = new Route();
        var builder = new RouteBuilder(map, { route: route });

        expect(builder.getRoute()).toEqual(route);
      });

      it('should bind events to its route', function() {
        var route;

        route = new Route();
        spyOn(route, 'on');

        new RouteBuilder(map, { route: route });
        expect(route.on).toHaveBeenCalled();
      });

      it('should set a Route', function() {
        var oldRoute = new Route();
        var builder = new RouteBuilder(map, { route: oldRoute });
        var newRoute = new Route();

        spyOn(newRoute, 'on');
        builder.setRoute(newRoute);
        expect(newRoute.on).toHaveBeenCalled();
      });

      it('should unbind route events', function() {
        var builder;
        var route = new Route();

        spyOn(route, 'on');
        spyOn(route, 'off');

        builder = new RouteBuilder(map, { route: route });

        builder.undelegateEvents();
        expect(route.off.callCount).toEqual(route.on.callCount);
      });

      it('should bind events to a new route, and clean up the old route\'s events', function() {
        var builder;
        var oldRoute = new Route();
        var newRoute = new Route();

        spyOn(oldRoute, 'on');
        spyOn(oldRoute, 'off');
        spyOn(newRoute, 'on');

        builder = new RouteBuilder(map, { route: oldRoute });
        builder.setRoute(newRoute);

        expect(oldRoute.off.callCount).toEqual(oldRoute.on.callCount);
        expect(newRoute.on.callCount).toEqual(oldRoute.on.callCount);
      });
    });

    /*it('should create a RouteRenderer, with its route and map', function() {
      var route = new Route();

      spyOn(aeris.maps.gmaps, 'RouteRenderer').andCallThrough();

      new RouteBuilder(map, { route: route });
      expect(aeris.maps.gmaps.RouteRenderer).toHaveBeenCalledWith(map, { route: route });
    });*/

    describe('Its RouteRenderer', function() {
      var route = new Route();
      it('should create a RouteRenderer', function() {
        spyOn(aeris.maps.gmaps.route, 'RouteRenderer');

        new RouteBuilder(map, { route: route });
        expect(aeris.maps.gmaps.route.RouteRenderer).toHaveBeenCalled();
      });

      it('should accept a RouteRenderer', function() {
        var route = new Route();
        var renderer = new RouteRenderer(map);
        spyOn(aeris.maps.gmaps.route, 'RouteRenderer');

        new RouteBuilder(map, { routeRenderer: renderer, route: route });

        // Check that RouteRendered not called a second time
        expect(aeris.maps.gmaps.route.RouteRenderer).not.toHaveBeenCalled();
      });
    });

    describe('Its AerisMap', function() {

      it('should require an AerisMap', function() {
        expect(function() {
          new RouteBuilder();
        }).toThrowType('InvalidArgumentError');
      });

      it('should bind events to an AerisMap', function() {
        spyOn(aeris.maps.Event.prototype, 'on');

        new RouteBuilder(map);
        expect(aeris.maps.Event.prototype.on).toHaveBeenCalled();
      });

      it('should unbind events from an AerisMap', function() {
        var builder;

        spyOn(aeris.maps.Event.prototype, 'on');
        spyOn(aeris.maps.Event.prototype, 'off');

        builder = new RouteBuilder(map);
        builder.undelegateMapEvents();

        expect(aeris.maps.Event.prototype.off).toHaveBeenCalled();
        expect(aeris.maps.Event.prototype.off.callCount).
          toEqual(aeris.maps.Event.prototype.on.callCount);
      });
    });

    describe('Map Events', function() {
      it('should bind the AddWayPointCommand to a map click', function() {
        // Pilfer the handler bound to the Click event
        var evtHandler, evtCtx;
        spyOn(aeris.maps.events.Click.prototype, 'on').andCallFake(function(topic, callback, ctx) {
          if (topic === 'click') {
            evtHandler = callback;
            evtCtx = ctx;
          }
        });

        // Spy on AddWaypointCommand
        spyOn(aeris.maps.gmaps.route.AddWaypointCommand.prototype, 'execute');


        new RouteBuilder(map);

        // Call the click event handler
        evtHandler.call(evtCtx, [45, -90]);

        // Check that the AddWaypoinCommand was executed
        expect(aeris.maps.gmaps.route.AddWaypointCommand.prototype.execute).toHaveBeenCalled();
      });
    });

    describe('Route Events', function() {
      it('renders an Icon on Route#add', function() {
        var route = new Route();
        var renderer = new RouteRenderer(map);
        var waypoint = new MockWaypoint(null, true);

        new RouteBuilder(map, { route: route, routeRenderer: renderer });

        spyOn(renderer, 'drawIcon');
        spyOn(renderer, 'drawPath');

        route.trigger('add', waypoint);
        expect(renderer.drawIcon).toHaveBeenCalledWith(waypoint);
        expect(renderer.drawPath).not.toHaveBeenCalled();
      });

      it('renders an path on adding two or more waypoints', function() {
        var wp1 = new MockWaypoint(null, true);
        var wp2 = new MockWaypoint();
        var wp3 = new MockWaypoint();
        var route = new Route();
        var renderer = new RouteRenderer(map);

        new RouteBuilder(map, { route: route, routeRenderer: renderer });

        spyOn(renderer, 'drawIcon');
        spyOn(renderer, 'drawPath');

        route.trigger('add', wp1);
        route.trigger('add', wp2);
        expect(renderer.drawIcon.callCount).toEqual(2);
        expect(renderer.drawPath.callCount).toEqual(1);
        expect(renderer.drawPath).toHaveBeenCalledWith(wp2.path);

        route.trigger('add', wp3);
        expect(renderer.drawIcon.callCount).toEqual(3);
        expect(renderer.drawPath.callCount).toEqual(2);
        expect(renderer.drawPath).toHaveBeenCalledWith(wp3.path);
      });
    });
  });
});
