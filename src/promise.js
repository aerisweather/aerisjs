define([
  'aeris/util',
  'aeris/errors/invalidargumenterror'
], function(_, InvalidArgumentError) {


  /**
   * Create a lightweight Promise for async related work.
   *
   * @constructor
   * @publicApi
   * @class aeris.Promise
   */
  var Promise = function() {


    /**
     * The current state of the promise (e.g. pending, resolved, or rejected).
     *
     * @type {string}
     * @property state
     */
    this.state = 'pending';


    /**
     * An array of arguments to send to the callbacks.
     *
     * @type {Array}
     * @private
     * @property arguments_
     */
    this.arguments_ = null;


    /**
     * @typedef {Array.<Array.<Function, Object>> callbackStore
     */
    /**
     * An object containing deferred callbacks for
     * resolved and rejected states.
     *
     * @type {{done: {callbackStore}, fail: {callbackStore}, always: {callbackStore}}}
     * @private
     * @property deferred_
     */
    this.deferred_ = {
      resolved: [],
      rejected: []
    };

    // Bind resolve/reject to the promise instance
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  };


  /**
   * Ensure a callback is called when the promise is resolved.
   *
   * @param {Function} callback
   * @param {Object} opt_ctx Callback context.
   * @method done
   */
  Promise.prototype.done = function(callback, opt_ctx) {
    this.bindCallbackToState_('resolved', callback, opt_ctx);

    return this;
  };


  /**
   * Ensure a callback is called when the promise is rejected.
   *
   * @param {Function} callback
   * @param {Object} opt_ctx Callback context.
   * @method fail
   */
  Promise.prototype.fail = function(callback, opt_ctx) {
    this.bindCallbackToState_('rejected', callback, opt_ctx);

    return this;
  };


  /**
   * Ensure a callback is called when the promise is either resolved or rejected.
   *
   * @param {Function} callback
   * @param {Object} opt_ctx Callback context.
   * @method always
   */
  Promise.prototype.always = function(callback, opt_ctx) {
    this.done(callback, opt_ctx);
    this.fail(callback, opt_ctx);

    return this;
  };


  /**
   * Ensure a callback is called when the promise adopts the specified state.
   *
   * @throws {aeris.errors.InvalidArgumentError} If no callback defined.
   *
   * @param {'resolved'|'rejected'} state
   * @param {Function} callback
   * @param {Object} opt_ctx Callback context.
   * @method bindCallbackToState_
   * @private
   */
  Promise.prototype.bindCallbackToState_ = function(state, callback, opt_ctx) {
    if (!_.isFunction(callback)) {
      throw new InvalidArgumentError('Invalid \'' + state + '\' state callback.');
    }

    // If state is already bound, immediately invoke callback
    if (this.state === state) {
      callback.apply(opt_ctx, this.arguments_);
    }
    else {
      this.deferred_[state].push([callback, opt_ctx]);
    }
  };


  /**
   * Mark a promise is resolved, passing in a variable number of arguments.
   *
   * @param {...*} var_args A variable number of arguments to pass to callbacks.
   * @method resolve
   */
  Promise.prototype.resolve = function(var_args) {
    this.adoptState_('resolved', arguments);
  };


  /**
   * Mark a promise is rejected, passing in a variable number of arguments.
   *
   * @param {...*} var_args
   * @method reject
   */
  Promise.prototype.reject = function(var_args) {
    this.adoptState_('rejected', arguments);
  };


  /**
   * Mark a promise with the specified state
   * passing in an array of arguments
   *
   * @param {'resolved'|'rejected'} state The state with which to mark the promise.
   * @param {Array} opt_args An array of responses to send to deferred callbacks.
   * @private
   * @method adoptState_
   */
  Promise.prototype.adoptState_ = function(state, opt_args) {
    var length;
    var callbacks;

    // Enforce state is 'rejected' or 'resolved'
    if (state !== 'rejected' && state !== 'resolved') {
      throw new Error('Invalid promise state: \'' + state + '\'. +' +
        'Valid states are \'resolved\' and \'rejected\'');
    }

    if (this.state === 'pending') {
      this.state = state;
      this.arguments_ = opt_args;

      // Run all callbacks
      callbacks = this.deferred_[this.state];
      length = callbacks.length;
      for (var i = 0; i < length; i++) {
        var fn = callbacks[i][0];
        var ctx = callbacks[i][1];
        fn.apply(ctx, this.arguments_);
      }

      // Cleanup callbacks
      for (var cbState in this.deferred_) {
        if (this.deferred_.hasOwnProperty(cbState)) {
          this.deferred_[cbState] = [];
        }
      }
    }
    // Do nothing if promise is already resolved/rejected
  };


  /**
   *
   * @return {string} The current state of the promise.
   *  'pending', 'resolved', or 'rejected'.
   * @method getState
   */
  Promise.prototype.getState = function() {
    return this.state;
  };


  /**
   * Resolve/reject the promise
   * when the proxy promise is resolved/rejected.
   *
   * @method {aeris.Promise} proxy
   */
  Promise.prototype.proxy = function(proxyPromise) {
    proxyPromise.
      done(this.resolve).
      fail(this.reject);

    return this;
  };


  /**
   * Create a master promise from a combination of promises.
   * Master promise is resolved when all component promises are resolved,
   * or rejected when any single component promise is rejected.
   *
   * @param {...*} var_args A variable number of promises to wait for or an.
   *                        array of promises.
   * @return {aeris.Promise} Master promise.
   * @method when
   */
  Promise.when = function(var_args) {
    var promises = Array.prototype.slice.call(arguments);
    var masterPromise = new Promise();
    var masterResponse = [];
    var resolvedCount = 0;

    // Allow first argument to be array of promises
    if (promises.length === 1 && promises[0] instanceof Array) {
      promises = promises[0];
    }

    promises.forEach(function(promise, i) {
      if (!(promise instanceof Promise)) {
        throw new InvalidArgumentError('Unable to create master promise: ' +
          promise.toString() + ' is not a valid Promise object');
      }

      promise.fail(function() {
        masterPromise.reject.apply(masterPromise, arguments);
      });

      promise.done(function() {
        var childResponse = _.argsToArray(arguments);
        masterResponse[i] = childResponse;
        resolvedCount++;

        if (resolvedCount === promises.length) {
          masterPromise.resolve.apply(masterPromise, masterResponse);
        }
      });
    }, this);

    // Resolve immediately if called with no promises
    if (promises.length === 0) {
      masterPromise.resolve();
    }

    return masterPromise;
  };


  /**
   * Calls the promiseFn with each member in `objects`.
   * Each call to the promiseFn will be postponed until the promise
   * returned by the previous call is resolved.
   *
   * @param {Array<*>} objects
   * @param {function():aeris.Promise} promiseFn
   * @return {aeris.Promise}
   *         Resolves with an array containing the resolution value of each
   *         call to the promiseFn.
   */
  Promise.sequence = function(objects, promiseFn) {
    var promiseToResolveAll = new Promise();
    var resolvedArgs = [];
    var rejectSequence = promiseToResolveAll.reject.
      bind(promiseToResolveAll);
    var resolveSequence = promiseToResolveAll.resolve.
      bind(promiseToResolveAll, resolvedArgs);

    var nextAt = function(i) {
      var next = _.partial(nextAt, i + 1);
      var obj = objects[i];

      if (obj) {
        Promise.callPromiseFn_(promiseFn, obj).
          done(function(arg) {
            // When the promiseFn resolves,
            // Save the resolution data
            // and run again with the next object.
            resolvedArgs.push(arg);
            next();
          }).
          fail(rejectSequence);
      }
      else {
        // No more objects exist,
        // --> we're done.
        resolveSequence();
      }
    };
    nextAt(0);

    return promiseToResolveAll;
  };


  /**
   *
   * @param {function():Promise} promiseFn
   * @param {*...} var_args
   * @private
   */
  Promise.callPromiseFn_ = function(promiseFn, var_args) {
    var args = Array.prototype.slice.call(arguments, 1);
    var promise = promiseFn.apply(null, args);

    if (!(promise instanceof Promise)) {
      throw new InvalidArgumentError('Promise.sequence expects the promiseFn ' +
        'argument to return an aeris.Promise object.');
    }

    return promise;
  };


  /**
   * Similar to Promise#when, but accepts a map function
   * which transforms array members into promises.
   *
   * eg.
   *
   *  var apiEndpoints = [ '/endpointA', '/endpointB' ];
   *
   *  function request(endpoint) {
   *  // .. returns a promise
   *  }
   *
   *  // Resolves when requests have completed for all endpoints.
   *  Promise.map(apiEndpoints, request);
   *
   * @param {Array} arr
   * @param {function(*):aeris.Promise} mapFn
   * @return {aeris.Promise}
   */
  Promise.map = function(arr, mapFn, opt_ctx) {
    return Promise.when(arr.map(mapFn, opt_ctx));
  };

  Promise.resolve = function(val) {
    var promise = new Promise();
    promise.resolve(val);
    return promise;
  };


  return _.expose(Promise, 'aeris.Promise');

});
