/**
 * @fileoverview Tests the AbstractRouteCommand class, using the MockRouteCommand
 * as a proxy.
 */
define([
  'mocks/routecommand',
  'testErrors/untestedspecerror',
  'testUtils',
  'gmaps/route/route'
], function(MockRouteCommand, UntestedSpecError, testUtils, Route) {
  describe('An AbstractRouteCommand', function() {
    var route, waypoints, waypoints_orig, command;

    beforeEach(function() {
      waypoints = testUtils.getMockWaypoints();
      waypoints_orig = waypoints.slice(0);
      route = new Route(waypoints);
      command = new MockRouteCommand(route);
    });

    afterEach(function() {
      testUtils.resetFlag();
      waypoints.length = 0;
      route = null;
      command = null;
    });



    it('should promise to execute', function() {
      command.execute().done(testUtils.setFlag);

      waitsFor(testUtils.checkFlag, 'command to execute', 100);
    });


    it('should require a route', function() {
      expect(function() {
        new MockRouteCommand(null);
      }).toThrowType('InvalidArgumentError');
    });

    it('should save the starting route state', function() {
      command.execute().done(testUtils.setFlag);

      // Confirm that route changes on execute
      waitsFor(testUtils.checkFlag, 'command to execute', 100);
      runs(function() {
        expect(route).not.toMatchRoute(new Route(waypoints_orig));

        testUtils.resetFlag();
        command.undo().done(testUtils.setFlag);
      });

      // Check that route reverts to original state
      waitsFor(testUtils.checkFlag, 'command to undo', 100);
      runs(function() {
        expect(route).toMatchRoute(new Route(waypoints_orig));
      });
    });

    it('should not execute a command twice', function() {
      command.execute().done(testUtils.setFlag);

      // Test: before command has completed execution;
      expect(function() {
        command.execute();
      }).toThrowType('CommandHistoryError');

      // Test: after command has completed execution
      waitsFor(testUtils.checkFlag, 'command to complete execution', 100);
      runs(function() {
        expect(function() {
          command.execute();
        }).toThrowType('CommandHistoryError');
      });
    });

    it('should not undo a command that has\'nt been executed', function() {
      expect(function() {
        command.undo();
      }).toThrowType('CommandHistoryError');

      command.execute();
    });

    it('should not undo a command that has already been undone', function() {
      command.execute();
      command.undo();

      expect(function() {
        command.undo();
      }).toThrowType('CommandHistoryError');
    });
    
    it('should wait to undo a command until execution is complete', function() {
      var executeComplete = false;
      var undoComplete = false;

      command.execute().done(function() {
        executeComplete = true;

        // Test: undo should not be finished yet
        expect(undoComplete).toEqual(false);
      });

      command.undo().done(function() {
        undoComplete = true;
      });

      // Double check that command executed
      waitsFor(function() {
        return undoComplete && executeComplete;
      }, 'execute and undo to complete', 300);
    });

    describe('should be able to execute, undo, and redo multiple times', function() {
      it('...ending in undo', function() {

        command.execute();
        command.undo();
        command.execute();
        command.undo();
        command.execute();
        command.undo();
        command.execute();
        command.undo().done(testUtils.setFlag);

        waitsFor(testUtils.checkFlag, 'command stack to complete', 1000);
        runs(function() {
          expect(route).toMatchRoute(new Route(waypoints_orig));
        });
      });

      it('...ending in execute', function() {

        command.execute();
        command.undo();
        command.execute();
        command.undo();
        command.execute();
        command.undo();
        command.execute();
        command.undo();
        command.execute().done(testUtils.setFlag);

        waitsFor(testUtils.checkFlag, 'command stack to complete', 1000);
        runs(function() {
          expect(route).not.toMatchRoute(new Route(waypoints_orig));
        });
      });

    });

    it('should wait to redo until undo is complete', function() {
      var redoComplete = false;

      command.execute();
      command.undo();
    });
  });
});
