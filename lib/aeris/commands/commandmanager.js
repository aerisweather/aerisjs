/**
 * @fileoverview Defines the CommandManager class.
*/
define([
  'aeris',
  'aeris/commands/abstractcommand',
  'aeris/promisequeue',
  'aeris/errors/invalidargumenterror',
  'aeris/errors/commandhistoryerror'
], function(aeris, AbstractCommand, PromiseQueue, InvalidArgumentError, CommandHistoryError) {
  aeris.provide('aeris.commands.CommandManager');


  /**
   * CommandManager
   * Handles execution and history of commands,
   * and queueing of asynchronous commands.
   *
   * Example:
   * var cm = new CommandManager();
   * cm.executeCommand(new CommandOne());
   * cm.executeCommand(new CommandTwo());   // waits for CommandOne to resolve
   * cm.undo();                             // waits for CommandTwo to resolve, the undoes CommandTwo
   * cm.undo();                             // waits for CommandTwo to resolve undo, then undoes CommandOne
   * cm.redo();                             // waits for CommandOne to resolve undo, then executes CommandOne
   * // etc...
   *
   *
   *
   * Note that attempts to execute a command that is not
   * available will throw a CommandHistoryError.
   *
   * To address this, you can catch CommandHistoryErrors:
   *
   * try {
   *  cm.undo();
   * } catch(e) {
   *  if (e instanceof CommandHistoryError) {
   *    $('#undoBtn').attr('disabled', disabled')
   *    alert('Unable to undo command: ' e.message);
   *  }
   *  else {
   *    // something else went wrong :(
   *    throw e;
   *  }
   * }
   *
   * Or, you can check the availability of a command
   * before executing:
   *
   * if (cm.canUndo()) {
   *  cm.undo();
   * }
   * else {
   *   alert('You can\'t undo what hasn\'t been done.');
   * }
   *
   *
   *
   * @constructor
   * @param {Object=} opt_options
   * @param {aeris.PromiseQueue=} opt_options.queueManager
   */
  aeris.commands.CommandManager = function(opt_options) {
    opt_options || (opt_options = {});

    /**
     * A list of executed commands
     * @type {Array.<aeris.commands.AbstractCommand>}
     * @private
     */
    this.executed_ = [];

    /**
     * A list of undone commands
     * @type {Array.<aeris.commands.AbstractCommand>}
     * @private
     */
    this.undone_ = [];


    this.queueManager_ = opt_options.queueManager || new PromiseQueue();
  };


  /**
   * Executes the command
   *
   * @param {aeris.commands.AbstractCommand} command
   * @return {aeris.promise} Promise to resolve command execution.
   */
  aeris.commands.CommandManager.prototype.executeCommand = function(command) {
    var promise;

    if (!(command instanceof AbstractCommand)) {
      throw new InvalidArgumentError('Invalid command.');
    }

    // Add the command to the queue
    promise = this.queueAndRun_(command.execute, command);

    // Add to execution history
    this.executed_.push(command);

    // Clear undone history, as they cannot be redone at this point
    this.undone_ = [];
    this.undone_.length = 0;

    return promise;
  };


  /**
   * Undoes the last executed command.
   *
   * @return {aeris.Promise}
   */
  aeris.commands.CommandManager.prototype.undo = function() {
    var command, promise;

    // Because I keep passing in a callback here, instead of to .done()
    if (arguments.length) {
      throw new InvalidArgumentError('Undo does not expect any arguments.');
    }

    if (!this.canUndo()) {
      throw new CommandHistoryError('Unable to undo: no command has been executed.');
    }

    // Remove command from executed list
    command = this.executed_.pop();

    // Undo command
    promise = this.queueAndRun_(command.undo, command);

    // Add to undo history
    this.undone_.push(command);

    return promise;
  };


  /**
   * Redoes the last executed command.
   *
   * @return {aeris.Promise}
   */
  aeris.commands.CommandManager.prototype.redo = function() {
    var command, promise;

    // Because I keep passing in a callback here, instead of to .done()
    if (arguments.length) {
      throw new InvalidArgumentError('Redo does not expect any arguments.');
    }

    if (!this.canRedo()) {
      throw new CommandHistoryError('Unable to redo: no command has been undone.');
    }

    // Remove command from undone list
    command = this.undone_.pop();

    // Redo (execute) command
    promise = this.queueAndRun_(command.execute, command);

    // Add to executed history
    this.executed_.push(command);

    return promise;
  };


  /**
   * @return {boolean} Whether there is a command to undo.
   */
  aeris.commands.CommandManager.prototype.canUndo = function() {
    return this.executed_.length >= 1;
  };


  /**
   * @return {boolean} Whether there is a command to redo.
   */
  aeris.commands.CommandManager.prototype.canRedo = function() {
    return this.undone_.length >= 1;
  };


  /**
   * Add a command action to the PromiseQueue,
   * and make sure the queue is running.
   *
   * @param {function(): aeris.Promise} fn The action to add to the queue.
   * @param {aeris.commands.AbstractCommand} command The command to which the action belongs.
   * @private
   */
  aeris.commands.CommandManager.prototype.queueAndRun_ = function(fn, command) {
    var promise;

    if (!(command instanceof AbstractCommand)) {
      throw new InvalidArgumentError('Command actions must be queued in the context of a Command.');
    }

    promise = this.queueManager_.queue(fn, command);

    if (!this.queueManager_.isRunning()) {
      this.queueManager_.dequeue();
    }

    return promise;
  };


  return aeris.commands.CommandManager;
});
