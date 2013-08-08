define([
  'aeris',
  'vendor/underscore',
  'aeris/errors/invalidargumenterror'
], function(aeris, _, InvalidArgumentError) {

  /**
   * @fileoverview A lightweight Publish/Subscribe library.
   */


  aeris.provide('aeris.Events');


  /**
   * Create a lightweight events manager.
   *
   * @constructor
   */
  aeris.Events = function() {


    /**
     * A hash of named subscriptions and an array of the subscribers.
     *
     * @type {Object.<string,Array.<Function>>}
     * @private
     */
    this.subscribers_ = {};


    /**
     * Store of event bindings
     * Used by listenTo and stopListening
     *
     * @type {Array}
     * @private
     */
    this.listeners_ = [
      // eg: [ObjectToListenTo, 'event:name', this.someHandler]
    ];
  };


  /**
   * Subscribe a callback function to a given subscription.
   *
   * @param {string} type The named subscription to subscribe to.
   * @param {Function} fn The callback function.
   * @param {Object=} opt_ctx An optional context to call the callback in.
   */
  aeris.Events.prototype.on = function(type, fn, opt_ctx) {
    if (!this.subscribers_[type])
      this.subscribers_[type] = [];
    this.subscribers_[type].push({
      fn: fn,
      ctx: opt_ctx || this
    });
  };


  /**
   * Unsubscribe a callback and/or context from a given subscription.
   *
   * @param {string} type The named subscription to unsubscribe from.
   * @param {Function=} opt_fn An optional callback function to match.
   * @param {Object=} otp_ctx An option context to match.
   * @return {number} The number of remaining listeners for the given type.
   */
  aeris.Events.prototype.off = function(type, opt_fn, opt_ctx) {
    var fn = opt_fn || false;
    var ctx = opt_ctx || false;
    var i = 0;

    if (!fn && !ctx) {
      this.subscribers_[type] = [];
    }

    else {
      // Check if topic exists
      if (!this.subscribers_[type]) {
        return 0;
      }

      // Remove all topic subscribers
      while (true) {
        var sub = this.subscribers_[type][i];
        if (!sub) {
          break;
        } else if (sub.fn === fn && sub.ctx === ctx ||
             sub.fn === fn && !ctx ||
             sub.ctx === ctx && !fn) {
          this.subscribers_[type].splice(i, 1);
          continue;
        }
        i++;
      }
    }
    return this.subscribers_[type].length;
  };


  /**
   * Trigger a named subscription and call all of the subscribed callbacks.
   *
   * @param {string} type The named subscription to trigger.
   * @param {...*} var_args Any number of arguments to pass to the callback
   *                        functions.
   */
  aeris.Events.prototype.trigger = function(type, var_arg) {
    var type_ = type;
    Array.prototype.shift.apply(arguments);
    var subscribers = this.subscribers_[type_] || [];
    subscribers = subscribers.slice(0);
    var length = subscribers.length;
    for (var i = 0; i < length; i++) {
      var sub = subscribers[i];
      sub.fn.apply(sub.ctx, arguments);
    }
  };


  /**
   * Remove all subscriptions.
   */
  aeris.Events.prototype.clear = function() {
    this.subscribers_ = {};
  };


  /**
   * Listen to an event triggered
   * by another {aeris.Events} object.
   *
   * Binding are stored internally,
   * so you can use {aeris.Events#stopListening}
   * to clean up events bound with {aeris.Events#listenTo}.
   *
   * @param {aeris.Events} obj The object to listen to.
   * @param {string} topic
   * @param {Function} handler
   */
  aeris.Events.prototype.listenTo = function(obj, topic, handler) {
    var throwInvalidArgumentError = function(problemArg) {
      throw new InvalidArgumentError('Unable to listen to object: ' +
        'invalid ' + problemArg + '.');
    };

    // Handler can be named method, or method reference.
    handler = _.isFunction(handler) ? handler : this[handler];

    // Check my arguments are valid
    if (!_.isString(topic)) { throwInvalidArgumentError('topic'); }
    if (!_.isFunction(handler)) { throwInvalidArgumentError('event handler'); }
    if (!_.isFunction(obj.on)) { throwInvalidArgumentError('aeris.Events object'); }

    // Bind the event to the object
    obj.on(topic, handler, this);

    // Save binding for future reference
    this.listeners_.push([obj, topic, handler]);
  };


  /**
   * Stop listening to events
   * which were bound with {aeris.Events#listenTo}.
   *
   * @param {aeris.Events=} opt_obj If no object is provided, clears all event bindings.
   */
  aeris.Events.prototype.stopListening = function(opt_obj) {
    if (_.isObject(opt_obj) && !_.isFunction(opt_obj.off)) {
      throw new InvalidArgumentError('Invalid aeris.Events object');
    }

    // Unbind previously bound events
    // And remove from this.listeners_
    this.listeners_ = _.reject(this.listeners_, function(args) {
      var obj = opt_obj || args[0];
      var isSameObj = _.isEqual(args[0], obj);

      if (isSameObj) {
        obj.off(args[1], args[2], this);
      }

      return isSameObj;
    }, this);
  };


  /**
   * Loop through events described in an
   * events hash, and call a callback with
   * each topic and handler.
   *
   * @param {Object.<string,Function|Array.<Function>>} eventHash
   * @param {function(string, Function)} callback Provided with topic and handler arguments.
   * @protected
   */
  aeris.Events.prototype.eachEventHash_ = function(eventHash, callback) {
    for (var topic in eventHash) {
      var handlers;

      if (eventHash.hasOwnProperty(topic)) {

        // Normalize handlers as an array of handlers
        handlers = _.isArray(eventHash[topic]) ?
          eventHash[topic] :
          [eventHash[topic]];

        // Bind each handler to event
        _.each(handlers, function(handler) {
          callback.call(this, topic, handler);
        }, this);
      }
    }
  };



  /**
   * Binds events described in a events hash.
   *
   * Example events hash
   *  {
   *    'change': [
   *      this.updateStuff_
   *      this.updateThings
   *    ],
   *    'remove': this.destroyEverything
   *  }
   *
   * @param {Object.<string,Function|Array.<Function>>} events Events has.
   * @param {aeris.Events=} obj Object to listen to. Defaults to this.
   * @param {Object=} ctx Optional context for handlers. Defaults to this.
   */
  aeris.Events.prototype.bindEvents = function(events, obj, ctx) {
    obj || (obj = this);
    ctx || (ctx = this);

    this.eachEventHash_(events, function(topic, handler) {
      obj.on(topic, handler, ctx);
    });
  };


  /**
   * Unbind events described in an events hash.
   *
   * @param {Object.<string,Function|Array.<Function>>} events Events hash.
   * @param {aeris.Events=} obj Object to unbind from. Defaults to this.
   * @param {Object=} ctx Optional context to match in unbinding.
   */
  aeris.Events.prototype.unbindEvents = function(events, obj, ctx) {
    obj || (obj = this);
    ctx || (ctx = this);

    this.eachEventHash_(events, function(topic, handler) {
      obj.off(topic, handler, ctx);
    });
  };


  /**
   * Proxies all events from another {aeris.Event} object.
   * In other words, all the events that you trigger,
   * I'm gonna trigger too.
   *
   * Passes along the original object as the first argument
   * when triggering proxied events.
   *
   * @param {aeris.Events=} obj The object to proxy.
   * @param {function(string, Array):{Object}=} opt_callback
   *        A callback function to customize the proxied event.
   *        Should return on object with 'topic' and 'args' properties.
   *
   *        Example:
   *          parent.proxy(child, function(topic, args) {
   *            return {
   *              topic: 'child:' + topic,
   *              args: [child].concat(args)
   *            }
   *          });
   *
   *        ...would trigger all child events, with a topic prepended
   *        with 'child:', and with the child object inserted as the first
   *        argument.
   * @param {Object=} opt_ctx
   *        A context in which to call the opt_callback function.
   *        Defaults to this.
   */
  aeris.Events.prototype.proxyEvents = function(obj, opt_callback, opt_ctx) {
    var trigger_orig = obj.trigger;
    var callback = opt_callback || function(topic, args) {
      return { topic: topic, args: args };
    };
    var ctx = opt_ctx || this;

    obj.trigger = function(topic, var_args) {
      // Process the callback
      // to get a new topic and arguments
      var args_orig = Array.prototype.slice.call(arguments, 1);
      var cbObj = callback.call(ctx, topic, args_orig);
      var args_proxy = [cbObj.topic].concat(cbObj.args);

      // Call the original object's trigger
      trigger_orig.apply(obj, arguments);

      // Call the proxying object's trigger
      this.trigger.apply(ctx, args_proxy);
    };
    obj.trigger = obj.trigger.bind(this);
  };


  /**
   * End any proxies that have been wrapped
   * around this {aeris.Events} object.
   */
  aeris.Events.prototype.removeProxy = function() {
    this.trigger = function() {
      aeris.Events.prototype.trigger.apply(this, arguments);
    };
    this.trigger = this.trigger.bind(this);
  };


  return aeris.Events;

});
