require([
  'aeris/promise',
  'sinon',
  'testUtils',
  'aeris/util',
  'aeris/collection',
  'gmaps/route/waypoint',
  'gmaps/route/route',
  'gmaps/route/routerenderer',
  'gmaps/route/routebuilder',
  'aeris/commands/abstractcommand',
  'aeris/commands/commandmanager'
], function(
    Promise,
    sinon,
    testUtils,
    _,
    Collection,
    Waypoint,
    Route,
    RouteRenderer,
    RouteBuilder,
    AbstractCommand,
    CommandManager
) {


  var MockRoute = function() {
    Collection.apply(this, arguments);
  };
  _.inherits(MockRoute, Route);


  var MockWaypoint = function() {};
  _.inherits(MockWaypoint, Waypoint);


  var MockRouteRenderer = function() {};
  _.inherits(MockRouteRenderer, RouteRenderer);


  var MockCommand = function() {};
  _.inherits(MockCommand, AbstractCommand);


  var MockCommandManager = function() {
    var methods = [
      'canUndo',
      'canRedo',
      'executeCommand',
      'undo',
      'redo'
    ];
    _.extend(this, jasmine.createSpyObj('CommandManager', methods));
  };
  _.inherits(MockCommandManager, CommandManager);



  describe('A RouteBuilder', function() {
    var waypoint;
    var route;
    var commandManager;
    var routeBuilder;
    var MockWaypoint;

    beforeEach(function() {
      MockWaypoint = jasmine.createSpy('MockWaypoint');
      waypoint = new MockWaypoint();
      route = new MockRoute();

      commandManager = new MockCommandManager();

      routeBuilder = new RouteBuilder({
        commandManager: commandManager,
        route: route,
        Waypoint: MockWaypoint
      });
    });


    describe('setRoute', function() {
      var newRoute;

      beforeEach(function() {
        newRoute = new MockRoute();
      });

      it('should set the route', function() {
        routeBuilder.setRoute(newRoute);
        expect(routeBuilder.getRoute()).toEqual(newRoute);
      });


      it('should unbind events from the old route', function() {
        spyOn(routeBuilder, 'undelegateRouteEvents');

        routeBuilder.setRoute(newRoute);

        expect(routeBuilder.undelegateRouteEvents).toHaveBeenCalled();
      });

      it('should bind events to the new route', function() {
        spyOn(routeBuilder, 'undelegateRouteEvents');
        spyOn(routeBuilder, 'delegateRouteEvents');

        routeBuilder.setRoute(newRoute);

        expect(routeBuilder.undelegateRouteEvents).toHaveBeenCalled();
        expect(routeBuilder.delegateRouteEvents).toHaveBeenCalled();
      });
    });


    describe('addWaypoint', function() {
      var AddWaypointCommand;
      var addWaypointCommand;


      beforeEach(function() {
        addWaypointCommand = new MockCommand();
        AddWaypointCommand = jasmine.createSpy('AddWaypointCommand').
          andReturn(addWaypointCommand);

        routeBuilder = new RouteBuilder({
          commandManager: commandManager,
          route: route,
          Waypoint: MockWaypoint,
          AddWaypointCommand: AddWaypointCommand
        });
      });

      it('should delegate to addWaypointAt, if an \'at\' options is set', function() {
        spyOn(routeBuilder, 'addWaypointAt');

        routeBuilder.addWaypoint(waypoint, { at: 7 });

        expect(routeBuilder.addWaypointAt).toHaveBeenCalledWith(waypoint, 7);

        // No execution from this method (addWaypointAt is stubbed out).
        expect(commandManager.executeCommand).not.toHaveBeenCalled();
      });

      it('should create an AddWaypointCommand with a provided waypoint', function() {
        routeBuilder.addWaypoint(waypoint);

        expect(AddWaypointCommand).toHaveBeenCalledWith(route, waypoint);
      });

      it('should create an AddWaypointCommand with a Waypoint created from the provided latLon', function() {
        var stubbedWaypointInstance = new MockWaypoint();

        MockWaypoint.andCallFake(function(attrs) {
          expect(attrs.position).toEqual([12, 34]);

          return stubbedWaypointInstance;
        });

        routeBuilder.addWaypoint([12, 34]);

        expect(AddWaypointCommand).toHaveBeenCalledWith(route, stubbedWaypointInstance);
        expect(MockWaypoint).toHaveBeenCalled();
      });

      it('should execute an AddWaypointCommand', function() {
        var stubbedCommand = new MockCommand();

        AddWaypointCommand.andReturn(stubbedCommand);

        routeBuilder.addWaypoint(waypoint);

        expect(commandManager.executeCommand).toHaveBeenCalledWith(stubbedCommand);
      });


      describe('addWaypointAt', function() {
        it('should execute an AddWaypoinCommand command with a provided waypoint.', function() {
          routeBuilder.addWaypointAt(waypoint, 7);

          expect(AddWaypointCommand).toHaveBeenCalledWith(route, waypoint, { at: 7 });
          expect(commandManager.executeCommand).toHaveBeenCalledWith(addWaypointCommand);
        });

        it('should execute a command with a generated waypoint, if only a latLon is provided', function() {
          var stubbedWaypointInstance = new MockWaypoint();

          MockWaypoint.andCallFake(function(attrs) {
            expect(attrs.position).toEqual([12, 34]);

            return stubbedWaypointInstance;
          });

          routeBuilder.addWaypointAt([12, 34], 7);

          expect(AddWaypointCommand).toHaveBeenCalledWith(route, stubbedWaypointInstance, { at: 7 });
          expect(commandManager.executeCommand).toHaveBeenCalledWith(addWaypointCommand);
        });
      });
    });


    describe('moveWaypoint', function() {
      var MoveWaypointCommand;
      var moveWaypointCommand;

      beforeEach(function() {
        moveWaypointCommand = new MockCommand();
        MoveWaypointCommand = jasmine.createSpy('MoveWaypointCommand').
          andReturn(moveWaypointCommand);

        routeBuilder = new RouteBuilder({
          commandManager: commandManager,
          route: route,
          Waypoint: MockWaypoint,
          MoveWaypointCommand: MoveWaypointCommand
        });
      });

      it('should execute a MoveWaypointCommand with the provided waypoint and latLon', function() {
        routeBuilder.moveWaypoint(waypoint, [ 45, -90 ]);

        expect(MoveWaypointCommand).toHaveBeenCalledWith(route, waypoint, [ 45, -90 ]);
        expect(commandManager.executeCommand).toHaveBeenCalledWith(moveWaypointCommand);
      });
    });


    describe('removeWaypoint', function() {
      var RemoveWaypointCommand;
      var removeWaypointCommand;

      beforeEach(function() {
        removeWaypointCommand = new MockCommand();
        RemoveWaypointCommand = jasmine.createSpy('MoveWaypointCommand').
          andReturn(removeWaypointCommand);

        routeBuilder = new RouteBuilder({
          commandManager: commandManager,
          route: route,
          Waypoint: MockWaypoint,
          RemoveWaypointCommand: RemoveWaypointCommand
        });
      });

      it('should execute a RemoveWaypointCommand with the specified waypoint', function() {
        routeBuilder.removeWaypoint(waypoint);

        expect(RemoveWaypointCommand).toHaveBeenCalledWith(route, waypoint);
        expect(commandManager.executeCommand).toHaveBeenCalledWith(removeWaypointCommand);
      });
    });


    describe('resetRoute', function() {
      var ResetRouteCommand;
      var resetRouteCommand;

      beforeEach(function() {
        resetRouteCommand = new MockCommand();
        ResetRouteCommand = jasmine.createSpy('MoveWaypointCommand').
          andReturn(resetRouteCommand);

        routeBuilder = new RouteBuilder({
          commandManager: commandManager,
          route: route,
          Waypoint: MockWaypoint,
          ResetRouteCommand: ResetRouteCommand
        });
      });

      it('should execute a ResetRouteCommand with the specified waypoint', function() {
        routeBuilder.resetRoute(waypoint);

        expect(ResetRouteCommand).toHaveBeenCalledWith(route, waypoint);
        expect(commandManager.executeCommand).toHaveBeenCalledWith(resetRouteCommand);
      });
    });

    describe('undo', function() {

      it('should undo a commandManager command', function() {
        routeBuilder.undo();
        expect(commandManager.undo).toHaveBeenCalled();
      });

    });

    describe('redo', function() {

      it('should redo a commandManager command', function() {
        routeBuilder.redo();
        expect(commandManager.redo).toHaveBeenCalled();
      });

    });
  });
});
