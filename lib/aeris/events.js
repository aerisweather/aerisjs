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


  return aeris.Events;

});
