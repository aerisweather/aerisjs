/**
 * @fileoverview Tests the AbstractRouteCommand class, using the MockRouteCommand
 * as a proxy.
 */
define([
  'aeris/promise',
  'mocks/routecommand',
  'testErrors/untestedspecerror',
  'testUtils',
  'gmaps/route/route'
], function(Promise, MockRouteCommand, UntestedSpecError, testUtils, Route) {
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
      var promise = command.execute();

      expect(promise).toBeInstanceOf(Promise);

      promise.done(testUtils.setFlag);
      waitsFor(testUtils.checkFlag, 'command to execute', 100);
    });

    it('should promise to undo', function() {
      command.execute().done(function() {
        var promise = command.undo();

        expect(promise).toBeInstanceOf(Promise);
        promise.done(testUtils.setFlag);
      });

      waitsFor(testUtils.checkFlag, 'promise to finish undoing', 200);
    });

    it('should handle rejected commands', function() {
      var failingFunction = function() {
        var promise = new Promise();
        promise.reject();
        return promise;
      };

      spyOn(MockRouteCommand.prototype, 'execute_').andCallFake(failingFunction);
      spyOn(MockRouteCommand.prototype, 'undo_').andCallFake(failingFunction);

      runs(function() {
        command.execute().fail(testUtils.setFlag);
      });
      waitsFor(testUtils.checkFlag, 'execution to fail', 100);

      runs(function() {
        testUtils.resetFlag();
        command.undo().fail(testUtils.setFlag);
      });
      waitsFor(testUtils.checkFlag, 'undo to fail', 100);
    });


    it('should require a route', function() {
      expect(function() {
        new MockRouteCommand('not a route');
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
    });

    it('should not undo a command that has already been undone', function() {
      command.execute().done(testUtils.setFlag);

      waitsFor(testUtils.checkFlag, 'command to execute', 100);
      runs(function() {
        testUtils.resetFlag();
        command.undo().done(testUtils.setFlag);
      });

      waitsFor(testUtils.checkFlag, 'undo to execute', 100);
      runs(function() {
        expect(function() {
          command.undo();
        }).toThrowType('CommandHistoryError');
      });
    });

    it('should not undo a command that is still in progress', function() {
      command.execute();
      expect(function() {
        command.undo();
      }).toThrowType('CommandHistoryError');
    });


    describe('should be able to execute, undo, and redo multiple times', function() {
      it('...ending in undo', function() {

        command.execute().done(function() {
          command.undo().done(function() {
            command.execute().done(function() {
              command.undo().done(testUtils.setFlag);
            });
          });
        });

        waitsFor(testUtils.checkFlag, 'command stack to complete', 1000);
        runs(function() {
          expect(route).toMatchRoute(new Route(waypoints_orig));
        });
      });

      it('...ending in execute', function() {

        command.execute().done(function() {
          command.undo().done(function() {
            command.execute().done(function() {
              command.undo().done(function() {
                command.execute().done(testUtils.setFlag);
              });
            });
          });
        });

        waitsFor(testUtils.checkFlag, 'command stack to complete', 1000);
        runs(function() {
          expect(route).not.toMatchRoute(new Route(waypoints_orig));
        });
      });

    });
  });
});
