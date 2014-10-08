define([
  'aeris/util',
  'aeris/maps/routes/commands/removewaypointcommand',
  'aeris/maps/routes/route',
  'aeris/model',
  'aeris/collection',
  'aeris/promise'
], function(_, RemoveWaypointCommand, Route, Model, Collection, Promise) {
  var MockWaypoint = function() {
    Model.apply(this, arguments);
  };
  _.inherits(MockWaypoint, Model);

  var MockRoute = function() {
    Collection.apply(this, arguments);
  };
  _.inherits(MockRoute, Route);


  describe('A RemoveWaypointCommand', function() {


    describe('execute', function() {
      var route, command, waypointToRemove;


      beforeEach(function() {
        route = new MockRoute();
        waypointToRemove = new MockWaypoint();
        route.add(waypointToRemove);

        command = new RemoveWaypointCommand(route, waypointToRemove);

        spyOn(route, 'remove');
      });


      it('should return a promise', function() {
        expect(command.execute()).toBeInstanceOf(Promise);
      });

      it('should remove the waypoint from the route', function() {
        command.execute();

        expect(route.remove).toHaveBeenCalledWith(waypointToRemove);
      });

      it('should resolve the promise immediately', function() {
        var promiseToExecute = command.execute();

        expect(promiseToExecute.getState()).toEqual('resolved');
      });

      it('should throw an error if the waypoint is not in the route', function() {
        var waypointNotInRoute = new MockWaypoint();
        var command = new RemoveWaypointCommand(route, waypointNotInRoute);

        expect(function() {
          command.execute();
        }).toThrowType('WaypointNotInRouteError');
      });

    });


    describe('undo', function() {
      var route, removedWaypoint, REMOVED_AT;
      var command;

      beforeEach(function() {
        REMOVED_AT = 1;
        route = new MockRoute([new MockWaypoint(), new MockWaypoint()]);
        removedWaypoint = new MockWaypoint();

        route.add(removedWaypoint, { at: REMOVED_AT });

        command = new RemoveWaypointCommand(route, removedWaypoint);

        command.execute();
      });


      it('should return a promise', function() {
        expect(command.undo()).toBeInstanceOf(Promise);
      });

      it('should add the waypoint back to the route', function() {
        command.undo();

        expect(route.contains(removedWaypoint)).toEqual(true);
      });

      it('should add the waypoint back in the same index at which it was added', function() {
        command.undo();

        expect(route.indexOf(removedWaypoint)).toEqual(REMOVED_AT);
      });

      it('should resolve its promise immediately', function() {
        var promiseToUndo = command.undo();

        expect(promiseToUndo.getState()).toEqual('resolved');
      });

    });

  });
});
