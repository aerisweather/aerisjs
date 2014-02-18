define([
  'aeris/promise',
  'aeris/errors/invalidargumenterror',
  'aeris/util'
], function(Promise, InvalidArgumentError, _) {
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
   * @class PromiseQueue
   * @namespace aeris
   */
  var PromiseQueue = function() {
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
     * @property queueStack_
     */
    this.queueStack_ = [];


    /**
     * Whether or not the queue should continue
     * executing functions.
     *
     * @type {boolean}
     * @private
     * @property isRunning_
     */
    this.isRunning_ = false;


    /**
     * Arguments with which queue promises
     * have been resolved/rejected.
     *
     * @type {Array}
     * @private
     * @property resolutionArgs_
     */
    this.resolutionArgs_ = [];
  };


  /**
   * Add a function to the queue
   *
   * @param {function(): aeris.Promise} fn
   * @param {Object=} opt_ctx Context in which to call the function.
   * @method queue
   */
  PromiseQueue.prototype.queue = function(fn, opt_ctx) {
    var queuePromise = new Promise();

    opt_ctx || (opt_ctx = window);

    if (!_.isFunction(fn)) {
      throw new InvalidArgumentError('Unable to queue non-function');
    }

    this.queueStack_.push([fn, opt_ctx, queuePromise]);

    return queuePromise;
  };


  PromiseQueue.prototype.clearQueue = function() {
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
   * @method dequeue
   */
  PromiseQueue.prototype.dequeue = function(opt_options) {
    var fnArr, fn, fnCtx, fnPromise, queuePromise;
    var options = _.extend({
      break: false
    }, opt_options);
    var dequeuePromise = arguments[1] || new Promise();

    this.isRunning_ = true;

    // Queue is complete
    if (!this.queueStack_.length) {
      this.isRunning_ = false;
      dequeuePromise.resolve.apply(dequeuePromise, this.resolutionArgs_);
      this.clearResolutionArgs_();

      return dequeuePromise;
    }

    // Remove first function
    fnArr = this.queueStack_.shift();
    fn = fnArr[0];
    fnCtx = fnArr[1];
    queuePromise = fnArr[2];


    // Execute function
    fnPromise = fn.call(fnCtx);

    // Check that function returns a promise
    if (!(fnPromise instanceof Promise)) {
      throw new InvalidArgumentError('Queued functions must return a aeris.Promise object');
    }

    // Wait for fn's promise to resolve
    // Then run the next fn in the queue
    fnPromise.
      done(queuePromise.resolve, queuePromise).
      fail(function() {
        if (options.break) {
          this.stop();
          dequeuePromise.reject.apply(dequeuePromise, arguments);
        }
        queuePromise.reject.apply(queuePromise, arguments);
      }, this).
      always(function() {
        if (this.isRunning()) {
          this.addResolutionArgs_(_.argsToArray(arguments));

          this.dequeue(options, dequeuePromise);
        }
      }, this);

    return dequeuePromise;
  };


  /**
   * Stops execution of the queue
   * @method stop
   */
  PromiseQueue.prototype.stop = function() {
    this.isRunning_ = false;
  };


  /**
   * @return {Boolean} Is the queue executing?
   * @method isRunning
   */
  PromiseQueue.prototype.isRunning = function() {
    return this.isRunning_;
  };


  /**
   * @param {Array} args
   * @private
   * @method addResolutionArgs_
   */
  PromiseQueue.prototype.addResolutionArgs_ = function(args) {
    this.resolutionArgs_.push(args);
  };


  /**
   * @private
   * @method clearResolutionArgs_
   */
  PromiseQueue.prototype.clearResolutionArgs_ = function() {
    this.resolutionArgs_ = [];
  };


  return PromiseQueue;
});

