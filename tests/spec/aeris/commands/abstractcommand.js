/**
 * @fileoverview Tests the AbstractCommand class, using the MockRouteCommand
 * as a proxy.
 */
define([
  'mocks/command',
  'aeris/promise',
  'testErrors/untestedspecerror',
  'testUtils'
], function(ConcreteCommand, Promise, UntestedSpecError, testUtils) {
  describe('An AbstractCommand', function() {


    it('should promise to execute', function() {
      var command = new ConcreteCommand();
      var promise = command.execute();

      expect(promise).toBeInstanceOf(Promise);

      promise.done(testUtils.setFlag);
      waitsFor(testUtils.checkFlag, 'command to execute', 100);
    });

    it('should promise to undo', function() {
      var command = new ConcreteCommand();

      command.execute().done(function() {
        var promise = command.undo();

        expect(promise).toBeInstanceOf(Promise);
        promise.done(testUtils.setFlag);
      });

      waitsFor(testUtils.checkFlag, 'promise to finish undoing', 200);
    });

    it('should handle rejected commands', function() {
      var command = new ConcreteCommand(false);

      command.execute().fail(testUtils.setFlag);

      waitsFor(testUtils.checkFlag, 'execution to fail', 100);

      // Then check for undo
      runs(function() {
        testUtils.resetFlag();
        command.undo().fail(testUtils.setFlag);
      });
      waitsFor(testUtils.checkFlag, 'undo to fail', 100);
    });

    it('should not execute a command twice', function() {
      var command = new ConcreteCommand();

      command.execute().done(testUtils.setFlag);

      // Test: execute a second time before command has completed execution;
      expect(function() {
        command.execute();
      }).toThrowType('CommandHistoryError');

      // Test: execute a second time after command has completed execution
      waitsFor(testUtils.checkFlag, 'command to complete execution', 100);
      runs(function() {
        expect(function() {
          command.execute();
        }).toThrowType('CommandHistoryError');
      });
    });

    it('should not undo a command that has\'nt been executed', function() {
      var command = new ConcreteCommand();

      expect(function() {
        command.undo();
      }).toThrowType('CommandHistoryError');
    });

    it('should not undo a command that has already been undone', function() {
      var command = new ConcreteCommand();

      // Execute
      command.execute().done(testUtils.setFlag);

      waitsFor(testUtils.checkFlag, 'command to execute', 100);
      runs(function() {
        testUtils.resetFlag();

        // Undo once...
        command.undo().done(testUtils.setFlag);
      });

      waitsFor(testUtils.checkFlag, 'undo to execute', 100);
      runs(function() {
        expect(function() {
          // Undo twice...
          command.undo();
        }).toThrowType('CommandHistoryError');
      });
    });

    it('should not undo a command that is still in progress', function() {
      var command = new ConcreteCommand();

      command.execute();
      expect(function() {
        // Execute hasn't completed yet
        command.undo();
      }).toThrowType('CommandHistoryError');
    });


    describe('should be able to execute, undo, and redo multiple times', function() {
      it('...ending in undo', function() {
        var command = new ConcreteCommand();

        command.execute().done(function() {
          command.undo().done(function() {
            command.execute().done(function() {
              command.undo().done(testUtils.setFlag);
            });
          });
        });

        waitsFor(testUtils.checkFlag, 'command stack to complete', 1000);
        runs(function() {
          expect(command).toBeUndone();
        });
      });

      it('...ending in execute', function() {
        var command = new ConcreteCommand();

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
          expect(command).toBeExecuted();
        });
      });

    });
  });
});
