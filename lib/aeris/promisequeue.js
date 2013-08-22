/**
 * @fileoverview Defines the PromiseQueue class.
*/
define([
  'aeris/promise',
  'aeris/errors/invalidargumenterror',
  'aeris/util'
], function(Promise, InvalidArgumentError, _) {

  _.provide('aeris.PromiseQueue');


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
  };


  /**
   * Add a function to the queue
   *
   * @param {function(): aeris.Promise} fn
   * @param {Object=} opt_ctx Context in which to call the function.
   */
  aeris.PromiseQueue.prototype.queue = function(fn, opt_ctx) {
    var queueItemPromise = new Promise();

    opt_ctx || (opt_ctx = window);

    if (!_.isFunction(fn)) {
      throw new InvalidArgumentError('Unable to queue non-function');
    }

    this.queueStack_.push([fn, opt_ctx, queueItemPromise]);

    return queueItemPromise;
  };


  aeris.PromiseQueue.prototype.clearQueue = function() {
    this.queueStack_.length = 0;
    this.stop();
  };


  /**
   * Begin executing the queue.
   *
   * @param {Object=} opt_options
   * @param {Boolean=} opt_options.break
   *                   Whether to stop the queue when a promise is rejected.
   *                   Defaults to false.
   *
   * @return {aeris.Promise} Promise to complete execution of the queue
   *                          including all component promises.
   */
  aeris.PromiseQueue.prototype.dequeue = function(opt_options) {
    var fnArr, fn, fnCtx, fnPromise, queueItemPromise;
    var options = _.extend({
      break: false,
      throttle: 0
    }, opt_options);
    var queueStackPromise = arguments[1] || new Promise();

    this.isRunning_ = true;

    // Queue is complete
    if (!this.queueStack_.length) {
      this.isRunning_ = false;
      queueStackPromise.resolve();
      return queueStackPromise;
    }

    // Remove first function
    fnArr = this.queueStack_.shift();
    fn = fnArr[0];
    fnCtx = fnArr[1];
    queueItemPromise = fnArr[2];


    // Execute function
    fnPromise = fn.call(fnCtx);

    // Check that function returns a promise
    if (!(fnPromise instanceof Promise)) {
      throw new InvalidArgumentError('Queued functions must return a aeris.Promise object');
    }

    // Wait for fn's promise to resolve
    // Then run the next fn in the queue
    fnPromise.
      done(queueItemPromise.resolve, queueItemPromise).
      fail(function() {
        if (options.break) {
          this.stop();
        }
        queueItemPromise.reject.apply(queueItemPromise, arguments);
      }, this).
      always(function() {
        if (this.isRunning()) {
          this.dequeue(options, queueStackPromise);
        }
      }, this);

    return queueStackPromise;
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

