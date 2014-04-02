define([
  'aeris/util',
  'aeris/promise',
  'aeris/errors/unimplementedmethoderror',
  'aeris/errors/invalidargumenterror',
  'aeris/errors/commandhistoryerror'
], function(_, Promise, UnimplementedMethodError, InvalidArgumentError, CommandHistoryError) {
  /**
   * AbstractCommand
   *
   * Base class for all commands.
   * Handles invalid command requests.
   *  eg: attempting to undo a command that hasn't been
   *      executed will throw a CommandHistoryError.
   *
   * Proper use of {aeris.commands.CommandManager}
   * will help you avoid these types of errors.
   *
   *
   * @abstract
   * @class AbstractCommand
   * @namespace aeris.commands
   * @constructor
   */
  var AbstractCommand = function() {
    /**
     * Is an action currently in progress / unresolved?
     *
     * @type {boolean}
     * @private
     * @property requestPending_
     */
    this.requestPending_ = false;


    /**
     * 1 = Execution requested (may not be complete)
     * 0 = Undo request
     * -1 = No actions requested
     * @type {number}
     * @property requestState_
     */
    this.requestState_ = -1;
  };


  /**
   * Execute the command.
   * wrapper around {aeris.commands.AbstractCommand}#execute_
   *
   * Note that classes extending from {aeris.commands.AbstractCommand}
   * should override the protected {aeris.commands.AbstractCommand}#execute_
   * method, which is called by the public {aeris.commands.AbstractCommand}#execute
   * method.
   *
   * @method execute
   * @final
   * @return {aeris.Promise} A promise to complete execution of the command.
   */
  AbstractCommand.prototype.execute = function() {
    var promise = new Promise();

    // Because I keep passing in a callback here, instead of to .done()
    if (arguments.length) {
      throw new InvalidArgumentError('Execute does not expect any arguments.');
    }

    if (this.requestState_ === 1) {
      throw new CommandHistoryError('Unable to execute command: command has already been executed');
    }
    else if (this.requestPending_) {
      throw new CommandHistoryError('Unable to execute command: undo is still in progress');
    }

    this.requestState_ = 1;
    this.requestPending_ = true;

    // Execute command
    this.execute_().
        always(function() {
          this.requestPending_ = false;
        }, this).
        done(promise.resolve, promise).
        fail(promise.reject, promise);


    return promise;
  };


  /**
   * Undo a command
   * wrapper around {aeris.commands.AbstractCommand}#undo_
   *
   * Note that classes extending from {aeris.commands.AbstractCommand}
   * should override the protected {aeris.commands.AbstractCommand}#undo_
   * method, which is called by the public {aeris.commands.AbstractCommand}#undo
   * method.
   *
   * @method undo
   * @final
   * @abstract
   * @return {aeris.Promise} A promise to complete the undo.
   */
  AbstractCommand.prototype.undo = function() {
    var promise = new Promise();

    // Because I keep passing in a callback here, instead of to .done()
    if (arguments.length) {
      throw new InvalidArgumentError('Undo does not expect any arguments.');
    }

    if (this.requestState_ !== 1) {
      throw new CommandHistoryError('Unable to undo command: command has not yet been executed');
    }
    else if (this.requestPending_) {
      throw new CommandHistoryError('Unable to undo command: command execution is still in progress.');
    }

    this.requestState_ = 0;
    this.requestPending_ = true;

    // Undo command
    this.undo_().
        always(function() {
          this.requestPending_ = false;
        }, this).
        done(promise.resolve, promise).
        fail(promise.reject, promise);

    return promise;
  };


  /**
   * Handle the business logic of executing a command.
   * Must return a {aeris.Promise}
   *
   * @private
   * @method execute_
   * @abstract
   * @return {aeris.Promise} A promise to execute the command.
   */
  AbstractCommand.prototype.execute_ = function() {
    throw new UnimplementedMethodError('Command has not implemented an execute_ method.');
  };


  /**
   * Handle the business logic of undoing a command
   * Must return a {aeris.Promise}
   *
   * @protected
   * @private undo_
   * @abstract
   * @return {aeris.Promise} A promise to undo the command.
   */
  AbstractCommand.prototype.undo_ = function() {
    throw new UnimplementedMethodError('Command has not implemented a undo_ method');
  };


  return AbstractCommand;
});
