/**
 * @fileoverview Defines the PromiseQueue class.
*/
define([
  'aeris',
  'aeris/promise',
  'aeris/errors/invalidargumenterror',
  'vendor/underscore'
], function(aeris, Promise, InvalidArgumentError, _) {

  aeris.provide('aeris.PromiseQueue');


  /**
   * PromiseQueue
   * Queues and executes asynchronous functions in sequential order.
   *
   * Functions added to the queue must return an {aeris.Promise}
   * object. Each function will only be executed after the previous
   * function's promise has resolved.
   *
   * Example:
   * function asyncMethod(endpoint) {
   *   var promise = new Promise();
   *   jsonp.get(endpoint).done(promise.resolve, promise);
   *   return promise;
   * }
   *
   * var pq = new PromiseQueue();
   * pq.queue(asyncMethod('firstEndpoint'));
   * pq.queue(asyncMethod('secondEndpoint')); // will not call method until first method resolves
   *
   * pq.dequeue(); // starts running the queue
   *
   * @constructor
   */
  aeris.PromiseQueue = function() {
    /**
     * A set of functions to execute.
     * In the format:
     * [
     *  [fnToExecute, context, promiseToResolveFn],
     *  ...
     * ]
     *
     * @type {Array.<Array>}
     * @private
     */
    this.queueStack_ = [];


    /**
     * Whether or not the queue should continue
     * executing functions.
     *
     * @type {boolean}
     * @private
     */
    this.isRunning_ = false;


    /**
     * A promise to complete dequeueing
     * all queued function.
     *
     * Resolved when all component promises are resolved.
     *
     * @type {aeris.promise}
     * @private
     */
    this.dequeuePromise_ = new Promise();
  };


  /**
   * Add a function to the queue
   *
   * @param {function(): aeris.Promise} fn
   * @param {Object=} opt_ctx Context in which to call the function.
   */
  aeris.PromiseQueue.prototype.queue = function(fn, opt_ctx) {
    var promise = new Promise();

    opt_ctx || (opt_ctx = window);

    if (!_.isFunction(fn)) {
      throw new InvalidArgumentError('Unable to queue non-function');
    }

    // If we're starting a new queue,
    // create a new dequeue promise
    if (!this.queueStack_.length) {
      this.dequeuePromise_ = new Promise();
    }

    this.queueStack_.push([fn, opt_ctx, promise]);

    return promise;
  };


  /**
   * Begin executing the queue.
   *
   * @return {aeris.Promise} Promise to complete execution of the queue
   *                          including all component promises.
   */
  aeris.PromiseQueue.prototype.dequeue = function() {
    var fnArr, fn, fnCtx, fnPromise, queuePromise;

    this.isRunning_ = true;

    // End of queue --> shut 'er down.
    if (!this.queueStack_.length) {
      this.isRunning_ = false;
      this.dequeuePromise_.resolve();
      return this.dequeuePromise_;
    }

    // Remove first function
    fnArr = this.queueStack_.shift();
    fn = fnArr[0];
    fnCtx = fnArr[1];
    queuePromise = fnArr[2];


    // Execute function
    fnPromise = fn.call(fnCtx);

    if (!(fnPromise instanceof Promise)) {
      throw new InvalidArgumentError('Queued functions must return a aeris.Promise object');
    }

    // Wait for fn's promise to resolve
    // Then run the next fn in the queue
    fnPromise.done(function() {
      // Resolve the promise made by the queue
      queuePromise.resolve();

      if (this.isRunning_) {
        this.dequeue();
      }
    }, this);

    return this.dequeuePromise_;
  };


  /**
   * Stops execution of the queue
   */
  aeris.PromiseQueue.prototype.stop = function() {
    this.isRunning_ = false;
  };


  /**
   * @return {Boolean} Is the queue executing?
   */
  aeris.PromiseQueue.prototype.isRunning = function() {
    return this.isRunning_;
  };


  return aeris.PromiseQueue;
});

