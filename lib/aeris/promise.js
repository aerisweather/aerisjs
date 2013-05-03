define(['aeris'], function(aeris) {

  /**
   * @fileoverview A lightweight Promise library.
   */


  aeris.provide('aeris.Promise');


  /**
   * Create a lightweight Promise for async related work.
   *
   * @constructor
   */
  aeris.Promise = function() {


    /**
     * The current state of the promise (e.g. pending or resolved).
     *
     * @type {string}
     */
    this.state = 'pending';


    /**
     * An array of arguments to send to the callbacks.
     *
     * @type {Array}
     * @private
     */
    this.arguments_ = null;


    /**
     * An array of deferred callbacks that should be called when the promise
     * is completed.
     *
     * @type {Array.<Function>}
     * @private
     */
    this.deferred_ = [];

  };


  /**
   * Ensure a callback is called when the promise is resolved.
   *
   * @param {Function} callback
   * @return {undefined}
   */
  aeris.Promise.prototype.done = function(callback) {
    this.deferred_.push(callback);
    if (this.state == 'resolved') {
      callback.apply(this, this.arguments_);
    }
  };


  /**
   * Mark a promise is resolved, passing in a variable number of arguments.
   *
   * @param {...*} var_args A variable number of arguments to pass to callbacks.
   * @return {undefined}
   */
  aeris.Promise.prototype.resolve = function(var_args) {
    if (this.state == 'pending') {
      this.state = 'resolved';
      this.arguments_ = arguments;
      var length = this.deferred_.length;
      for (var i = 0; i < length; i++) {
        this.deferred_[i].apply(this, arguments);
      }
    }
  };


  return aeris.Promise;

});
