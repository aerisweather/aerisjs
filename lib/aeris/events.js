define(['aeris'], function(aeris) {

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
    var length = subscribers.length;
    for (var i = 0; i < length; i++) {
      var sub = subscribers[i];
      sub.fn.apply(sub.ctx, arguments);
    }
  };


  return aeris.Events;

});
