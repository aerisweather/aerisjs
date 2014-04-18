require([
  'aeris/promise',
  'sinon',
  'testUtils',
  'aeris/util',
  'aeris/model',
  'aeris/collection',
  'aeris/maps/routes/waypoint',
  'aeris/maps/routes/route',
  'aeris/maps/routes/routerenderer',
  'aeris/maps/routes/routebuilder',
  'aeris/commands/abstractcommand',
  'aeris/commands/commandmanager'
], function(
    Promise,
    sinon,
    testUtils,
    _,
    Model,
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

    spyOn(this, 'toJSON');
  };
  _.inherits(MockRoute, Route);

  MockRoute.prototype.triggerLatLonEvent = function(topic, opt_latLon, opt_waypoint) {
    var stubbedLatLon = opt_latLon || [83.7, 42.9];
    var stubbedWaypoint = opt_waypoint || new MockWaypoint();

    this.trigger(topic, stubbedLatLon, stubbedWaypoint);
  };


  var MockWaypoint = function() {
    var stubbedMethods = [
      'validate',
      'stylePath'
    ];

    Model.apply(this, arguments);

    _.extend(this, jasmine.createSpyObj('MockWaypoint', stubbedMethods));
  };
  _.inherits(MockWaypoint, Waypoint);


  var MockRouteRenderer = function() {
    var stubbedMethods = [
      'setStyles',
      'renderWaypoint',
      'eraseWaypoint',
      'renderRoute',
      'eraseRoute'
    ];

    _.extend(this, jasmine.createSpyObj('routeRenderer', stubbedMethods));
  };
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
    var routeRenderer;

    beforeEach(function() {
      waypoint = new MockWaypoint();
      route = new MockRoute();
      routeRenderer = new MockRouteRenderer();

      commandManager = new MockCommandManager();

      routeBuilder = new RouteBuilder({
        commandManager: commandManager,
        route: route,
        routeRenderer: routeRenderer,
        Waypoint: MockWaypoint
      });
    });


    describe('constructor', function() {

      it('should set styles on the route renderer', function() {
        new RouteBuilder({
          styles: { some: 'styles' },
          routeRenderer: routeRenderer
        });

        expect(routeRenderer.setStyles).toHaveBeenCalledWith({ some: 'styles' });
      });

    });


    describe('Events', function() {
      var eventListener;

      beforeEach(function() {
        eventListener = jasmine.createSpy('eventListener');
      });


      describe('waypoint:click', function() {

        beforeEach(function() {
          routeBuilder.on('waypoint:click', eventListener);
        });


        it('should proxy the route#click event', function() {
          route.triggerLatLonEvent('click');

          expect(eventListener).toHaveBeenCalled();
        });

        it('should provide a latLon and a waypoint', function() {
          var waypoint = new MockWaypoint();
          route.triggerLatLonEvent('click', [42, 73], waypoint);

          expect(eventListener).toHaveBeenCalledWith([42, 73], waypoint);
        });

      });

      describe('waypoint:dragend', function() {

        beforeEach(function() {
          routeBuilder.on('waypoint:dragend', eventListener);
        });


        it('should proxy the route#dragend event', function() {
          route.triggerLatLonEvent('dragend');
          expect(eventListener).toHaveBeenCalled();
        });

        it('should provide a latLon and waypoint', function() {
          var waypoint = new MockWaypoint();
          route.triggerLatLonEvent('dragend', [12, 34], waypoint);

          expect(eventListener).toHaveBeenCalledWith([12, 34], waypoint);
        });

      });

      describe('path:click', function() {

        beforeEach(function() {
          routeBuilder.on('path:click', eventListener);
        });


        it('should proxy the route#path:click event', function() {
          route.triggerLatLonEvent('path:click');
          expect(eventListener).toHaveBeenCalled();
        });

        it('should provide a latLon and a waypoint', function() {
          var waypoint = new MockWaypoint();
          route.triggerLatLonEvent('path:click', [12, 34], waypoint);

          expect(eventListener).toHaveBeenCalledWith([12, 34], waypoint);
        });

      });

    });


    describe('Route bindings', function() {

      it('should erase a waypoint removed from a route', function() {
        var removedWaypoint = new MockWaypoint();
        route.add(removedWaypoint);

        route.remove(removedWaypoint);

        expect(routeRenderer.eraseWaypoint).toHaveBeenCalledWith(removedWaypoint);
      });

      it('should erase all old waypoints when a route is reset', function() {
        var oldWaypoints = [new MockWaypoint(), new MockWaypoint()];
        var newWaypoints = [new MockWaypoint(), new MockWaypoint()];
        route.add(oldWaypoints);

        route.reset(newWaypoints);

        _.each(oldWaypoints, function(waypoint) {
          expect(routeRenderer.eraseWaypoint).toHaveBeenCalledWith(waypoint);
        });

        expect(routeRenderer.renderRoute).toHaveBeenCalledWith(route);
      });

      it('should render an added waypoint', function() {
        var addedWaypoint = new MockWaypoint();

        route.add(addedWaypoint);

        expect(routeRenderer.renderWaypoint).toHaveBeenCalledWith(addedWaypoint);
      });

      it('should set the travelMode on an added waypoint', function() {
        var addedWaypoint = new MockWaypoint();
        var TRAVEL_MODE = 'FLYING';
        routeBuilder.travelMode = TRAVEL_MODE;

        route.add(addedWaypoint);

        expect(addedWaypoint.get('travelMode')).toEqual(TRAVEL_MODE);
      });

      it('should set the followDirections attribute of an added waypoint', function() {
        var addedWaypoint = new MockWaypoint();
        var FOLLOW_DIRECTIONS = 'maybe';
        routeBuilder.followDirections = FOLLOW_DIRECTIONS;

        route.add(addedWaypoint);

        expect(addedWaypoint.get('followDirections')).toEqual(FOLLOW_DIRECTIONS);
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

      it('should execute an AddWaypointCommand', function() {
        var stubbedCommand = new MockCommand();

        AddWaypointCommand.andReturn(stubbedCommand);

        routeBuilder.addWaypoint(waypoint);

        expect(commandManager.executeCommand).toHaveBeenCalledWith(stubbedCommand);
      });

      it('should update the waypoint\'s followDirections and travelMode before adding it', function() {
        routeBuilder.followDirections = 'RB_FOLLOW_DIRECTIONS';
        routeBuilder.travelMode = 'RB_TRAVEL_MODE';

        waypoint.set({
          followDirections: 'WAYPOINT_FOLLOW_DIRECTIONS',
          travelMode: 'WAYPOINT_TRAVEL_MODE'
        });

        AddWaypointCommand.andCallFake(function(route, waypoint) {
          expect(waypoint.get('followDirections')).toEqual(routeBuilder.followDirections);
          expect(waypoint.get('travelMode')).toEqual(routeBuilder.travelMode);
          return new MockCommand();
        });

        routeBuilder.addWaypoint(waypoint);

        expect(AddWaypointCommand).toHaveBeenCalled();
      });


      describe('addWaypointAt', function() {
        it('should execute an AddWaypoinCommand command with a provided waypoint.', function() {
          routeBuilder.addWaypointAt(waypoint, 7);

          expect(AddWaypointCommand).toHaveBeenCalledWith(route, waypoint, { at: 7 });
          expect(commandManager.executeCommand).toHaveBeenCalledWith(addWaypointCommand);
        });

        it('should update the waypoint\'s followDirections and travelMode before adding it', function() {
          routeBuilder.followDirections = 'RB_FOLLOW_DIRECTIONS';
          routeBuilder.travelMode = 'RB_TRAVEL_MODE';

          waypoint.set({
            followDirections: 'WAYPOINT_FOLLOW_DIRECTIONS',
            travelMode: 'WAYPOINT_TRAVEL_MODE'
          });

          AddWaypointCommand.andCallFake(function(route, waypoint) {
            expect(waypoint.get('followDirections')).toEqual(routeBuilder.followDirections);
            expect(waypoint.get('travelMode')).toEqual(routeBuilder.travelMode);
            return new MockCommand();
          });

          routeBuilder.addWaypointAt(waypoint);

          expect(AddWaypointCommand).toHaveBeenCalled();
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
          MoveWaypointCommand: MoveWaypointCommand
        });
      });

      it('should execute a MoveWaypointCommand with the provided waypoint and latLon', function() {
        routeBuilder.moveWaypoint(waypoint, [45, -90]);

        expect(MoveWaypointCommand).toHaveBeenCalledWith(route, waypoint, [45, -90]);
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
          ResetRouteCommand: ResetRouteCommand
        });
      });

      it('should execute a ResetRouteCommand with the specified waypoint', function() {
        routeBuilder.resetRoute(waypoint);

        expect(ResetRouteCommand).toHaveBeenCalledWith(route, waypoint);
        expect(commandManager.executeCommand).toHaveBeenCalledWith(resetRouteCommand);
      });
    });

    describe('appendReverseRoute', function() {
      var appendReverseRouteCommand;
      var AppendReverseRouteCommand;

      beforeEach(function() {
        appendReverseRouteCommand = new MockCommand();
        AppendReverseRouteCommand = jasmine.createSpy('AppendReverseRouteCommand').
          andReturn(appendReverseRouteCommand);

        routeBuilder = new RouteBuilder({
          commandManager: commandManager,
          route: route,
          routeRenderer: new MockRouteRenderer(),
          AppendReverseRouteCommand: AppendReverseRouteCommand
        });
      });


      it('should execute an AppendReturnRoute command', function() {
        route.add([new MockWaypoint(), new MockWaypoint()]);
        routeBuilder.appendReverseRoute();

        expect(AppendReverseRouteCommand).toHaveBeenCalledWith(route);
        expect(commandManager.executeCommand).toHaveBeenCalledWith(appendReverseRouteCommand);
      });

      it('should not execute the command if the route has no waypoints', function() {
        routeBuilder.appendReverseRoute();

        expect(AppendReverseRouteCommand).not.toHaveBeenCalled();
        expect(commandManager.executeCommand).not.toHaveBeenCalled();
      });

      it('should not execute the command if the route has a single waypoints', function() {
        route.add([new MockWaypoint()]);
        routeBuilder.appendReverseRoute();

        expect(AppendReverseRouteCommand).not.toHaveBeenCalled();
        expect(commandManager.executeCommand).not.toHaveBeenCalled();
      });
    });


    describe('routeToJSON', function() {

      it('should return the route as a JSON object', function() {
        var ROUTE_JSON_STUB = { json: 'STUB' };
        route.toJSON.andReturn(ROUTE_JSON_STUB);

        expect(routeBuilder.routeToJSON()).toEqual(ROUTE_JSON_STUB);
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
