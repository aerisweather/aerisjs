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
    this.state = 'pending';
    this.arguments = null;
    this.deferred = [];
  };


  /**
   * Ensure a callback is called when the promise is resolved.
   *
   * @param {Function} callback
   * @return {undefined}
   */
  aeris.Promise.prototype.done = function(callback) {
    this.deferred.push(callback);
    if (this.state == 'resolved') {
      callback.apply(this, this.arguments);
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
      this.arguments = arguments;
      var length = this.deferred.length;
      for (var i = 0; i < length; i++) {
        this.deferred[i].apply(this, arguments);
      }
    }
  };


  return aeris.Promise;

});
