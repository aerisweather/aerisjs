require([
  'aeris',
  'aeris/promise',
  'jasmine',
  'sinon',
  'testUtils',
  'vendor/underscore',
  'gmaps/route/waypoint',
  'gmaps/route/route',
  'gmaps/route/routerenderer',
  'gmaps/route/routebuilder',
  'aeris/commands/commandmanager',
  'gmaps/route/commands/addwaypointcommand',
  'gmaps/route/commands/removewaypointcommand',
  'gmaps/route/commands/resetroutecommand',
  'testErrors/untestedspecerror'
], function(
    aeris,
    Promise,
    jasmine,
    sinon,
    testUtils,
    _,
    Waypoint,
    Route,
    RouteRenderer,
    RouteBuilder,
    CommandManager,
    AddWaypointCommand,
    RemoveWaypointCommand,
    ResetRouteCommand,
    UntestedSpecError
) {

  function getStubbedWaypoint() {
    return sinon.createStubInstance(Waypoint);
  }

  function getStubbedRoute() {
    return sinon.createStubInstance(Route);
  }


  function getStubbedRenderer() {
    return sinon.createStubInstance(RouteRenderer);
  }

  function getStubbedCommandManager() {
    return sinon.createStubInstance(CommandManager);
  }

  var RouteBuilderFactory = function(opt_options) {
    var options = _.extend({}, opt_options);
    this.renderer_ = getStubbedRenderer(options.renderer);
    this.commandManager_ = getStubbedCommandManager(options.renderer);
    this.route_ = getStubbedRoute(options.route);
    this.builder_ = null;

    if (options.build !== false) {
      this.build();
    }
  };
  RouteBuilderFactory.prototype = {
    /**
     * Create the route builder instance.
     * @return {aeris.maps.gmaps.route.RouteBuilder}
     */
    build: function() {
      this.builder_ = getRouteBuilder({
        route: this.getRoute(),
        routeRenderer: this.getRenderer(),
        commandManager: this.getCommandManager()
      });

      // Stub to return factory route
      spyOn(this.builder_, 'getRoute').andReturn(this.getRoute());

      return this.builder_;
    },

    getRoute: function() { return this.route_; },
    getRenderer: function() { return this.renderer_; },
    getCommandManager: function() { return this.commandManager_; },
    getBuilder: function() { return this.builder_; },

    destroy: function() {
      // Clean up?
    }
  };

  /**
   * RouteBuilder factory
   * With stubbed dependency
   *
   * @param {Object=} opt_options Any options accepted by RouteBuilder constructor.
   * @return {aeris.maps.gmaps.route.RouteBuilder}
   */
  function getRouteBuilder(opt_options) {
    var options = _.extend({}, opt_options);

    return new RouteBuilder({
      route: options.route,
      commandManager: options.commandManager,
      routeRenderer: options.routeRenderer
    });
  }


  describe('A RouteBuilder', function() {
    var factory;

    beforeEach(function() {
      factory = new RouteBuilderFactory({ build: false });
    });

    afterEach(function() {
      factory.destroy();
      factory = null;
    });

    describe('Its Route', function() {

      it('should return its route with getRoute()', function() {
        var route = getStubbedRoute();
        var builder = getRouteBuilder({
          route: route,
          commandManager: getStubbedCommandManager(),
          routeRenderer: getStubbedRenderer()
        });

        expect(builder.getRoute()).toEqual(route);
      });

      it('should set a Route', function() {
        var builder = getRouteBuilder({
          route: getStubbedRoute(),
          commandManager: getStubbedCommandManager(),
          routeRenderer: getStubbedRenderer()
        });
        var newRoute = getStubbedRoute();
        builder.setRoute(newRoute);

        expect(builder.getRoute()).toEqual(newRoute);
      });

      it('should unbind route events', function() {
        spyOn(factory.getRoute(), 'on');
        spyOn(factory.getRoute(), 'off');

        factory.build();
        factory.getBuilder().undelegateEvents();

        // Check that as many events have been unbound,
        // as have been bound.
        expect(factory.getRoute().off.callCount).toEqual(factory.getRoute().on.callCount);
      });

      it('should bind events to a new route', function() {
        var newRoute = getStubbedRoute();

        spyOn(newRoute, 'on');

        factory.build();

        // Set the new route
        factory.getBuilder().getRoute.andReturn(newRoute);
        factory.getBuilder().setRoute(newRoute);

        // Bind as many events to the new route as to the old
        expect(newRoute.on.callCount).toEqual(factory.getRoute().on.callCount);
      });

      it('should clean up old route events', function() {
        spyOn(factory.getRoute(), 'on');
        spyOn(factory.getRoute(), 'off');

        factory.build();

        // It would be difficult to test the setRoute method
        // with a stubbed getRoute method
        factory.getBuilder().getRoute.andCallThrough();

        // Set a new route
        factory.getBuilder().setRoute(getStubbedRoute());

        // Unbind as many events from the old route as were originally bound
        expect(factory.getRoute().off.callCount).toEqual(factory.getRoute().on.callCount);
      });
    });

    it('should return it\'s renderer', function() {
      factory.build();

      expect(factory.getBuilder().getRenderer()).toEqual(factory.getRenderer());
    });


    describe('Manage Waypoints using commands', function() {
      describe('should add a waypoint', function() {
        var waypoint, commandStub;

        beforeEach(function() {
          waypoint = getStubbedWaypoint();
          commandStub = sinon.createStubInstance(AddWaypointCommand);

          factory.build();

          // Stub AddWaypointCommand instance
          // and spy on constructor
          spyOn(aeris.maps.gmaps.route.commands, 'AddWaypointCommand')
            .andReturn(commandStub);
          spyOn(factory.getCommandManager(), 'executeCommand');
        });

        afterEach(function() {
          expect(factory.getCommandManager().executeCommand).toHaveBeenCalledWith(commandStub);
        });

        it('at the end of  route', function() {
          factory.getBuilder().addWaypoint(waypoint);

          expect(aeris.maps.gmaps.route.commands.AddWaypointCommand).toHaveBeenCalledWith(
            factory.getRoute(),
            waypoint,
            {}
          );
        });

        it('should add a waypoint at a specified index', function() {
          var index = 3;

          factory.getBuilder().addWaypoint(waypoint, { at: index });

          expect(aeris.maps.gmaps.route.commands.AddWaypointCommand).toHaveBeenCalledWith(
            factory.getRoute(),
            waypoint,
            { at: index }
          );
        });
      });

      it('should move a waypoint', function() {
        var waypoint = getStubbedWaypoint();
        var latLon = testUtils.getRandomLatLon();

        factory.build();

        spyOn(factory.getCommandManager(), 'executeCommand').andCallFake(function(command) {
          expect(command).toBeInstanceOf(aeris.maps.gmaps.route.commands.MoveWaypointCommand);
        });
        spyOn(aeris.maps.gmaps.route.commands, 'MoveWaypointCommand');

        factory.getBuilder().moveWaypoint(waypoint, latLon);

        expect(aeris.maps.gmaps.route.commands.MoveWaypointCommand).
          toHaveBeenCalledWith(factory.getRoute(), waypoint, latLon);
        expect(factory.getCommandManager().executeCommand).toHaveBeenCalled();
      });

      it('should remove a waypoint', function() {
        var waypoint = getStubbedWaypoint();
        var commandStub = sinon.createStubInstance(RemoveWaypointCommand);

        factory.build();

        // Stub remove waypoint command,
        // and spy on constructor
        spyOn(aeris.maps.gmaps.route.commands, 'RemoveWaypointCommand').
          andReturn(commandStub);

        spyOn(factory.getCommandManager(), 'executeCommand');

        // Get passed 'waypoint exists in route' check
        spyOn(factory.getRoute(), 'has').andCallFake(function(wp) {
          expect(wp).toEqual(waypoint);
          return true;
        });

        factory.getBuilder().removeWaypoint(waypoint);

        expect(aeris.maps.gmaps.route.commands.RemoveWaypointCommand).toHaveBeenCalledWith(factory.getRoute(), waypoint);
        expect(factory.getCommandManager().executeCommand).toHaveBeenCalledWith(commandStub);
      });

      it('should reset waypoints', function() {
        var commandStub = sinon.createStubInstance(ResetRouteCommand);
        var fakeWaypoints = [
          getStubbedWaypoint(),
          getStubbedWaypoint(),
          getStubbedWaypoint()
        ];
        factory.build();

        spyOn(aeris.maps.gmaps.route.commands, 'ResetRouteCommand').
          andReturn(commandStub);
        spyOn(factory.getCommandManager(), 'executeCommand');

        factory.getBuilder().resetRoute(fakeWaypoints);

        expect(aeris.maps.gmaps.route.commands.ResetRouteCommand).toHaveBeenCalledWith(
          factory.getRoute(),
          fakeWaypoints
        );
        expect(factory.getCommandManager().executeCommand).toHaveBeenCalledWith(commandStub);
      });

      it('should undo and redo commands, using a CommandManager', function() {
        factory.build();

        spyOn(factory.getCommandManager(), 'undo');
        spyOn(factory.getCommandManager(), 'redo');

        factory.getBuilder().undo();
        expect(factory.getCommandManager().undo).toHaveBeenCalled();

        factory.getBuilder().redo();
        expect(factory.getCommandManager().redo).toHaveBeenCalled();
      });
    });
  });
});
