define([
  'aeris/util',
  'aeris/errors/invalidargumenterror',
  'aeris/commands/abstractcommand',
  'aeris/promise'
], function(_, InvalidArgumentError, AbstractCommand, Promise) {

  // Testers specific to this mock implementation
  // To test whether the command has been executed/undone
  beforeEach(function() {
    this.addMatchers({
      toBeUndone: function() {
        if (!(this.actual instanceof ConcreteCommand)) {
          throw new InvalidArgumentError('toBeUndone matcher requires a ConcreteCommand');
        }

        return this.actual.getState() === 0;
      },
      toBeExecuted: function() {
        if (!(this.actual instanceof ConcreteCommand)) {
          throw new InvalidArgumentError('toBeExecuted matcher requires a ConcreteCommand');
        }

        return this.actual.getState() === 1;
      }
    });
  });


  /**
   * A mock implementation of {aeris.AbstractCommand}
   *
   * @param {Boolean=true} opt_isResolving Whether to resolve execute/undo commands.
   * @param {number=25} opt_timeout Delay before resolving command.
   * @constructor
   * @extends {aeris.AbstractCommand}
   */
  var ConcreteCommand = function(opt_isResolving, opt_timeout) {
    this.isResolving_ = opt_isResolving === undefined ? true : opt_isResolving;
    this.timeout_ = opt_timeout === undefined ? 25 : opt_timeout;

    // -1 --> never executed
    // 0  --> undone
    // 1  --> executed
    this.state_ = -1;
  };
  _.inherits(ConcreteCommand, AbstractCommand);

  ConcreteCommand.prototype.execute_ = function() {
    var promise = new Promise();
    var self = this;

    window.setTimeout(function() {
      if (self.isResolving_) {
        self.state_ = 1;
        promise.resolve();
      }
      else { promise.reject(); }
    }, this.timeout_);

    return promise;
  };

  ConcreteCommand.prototype.undo_ = function() {
    var promise = new Promise();
    var self = this;

    window.setTimeout(function() {
      if (self.isResolving_) {
        self.state_ = 0;
        promise.resolve();
      }
      else { promise.reject(); }
    }, this.timeout_);

    return promise;
  };

  ConcreteCommand.prototype.getState = function() {
    return this.state_;
  };

  return ConcreteCommand;
});
