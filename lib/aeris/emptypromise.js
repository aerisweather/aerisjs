/**
 * @fileoverview Defines an EmptyPromise.
*/
define([
  'aeris',
  'aeris/promise'
], function(aeris, Promise) {
  /**
   * An immediately resolved or rejected promise.
   *
   * Useful for methods that must return a promise,
   * but which don't deal with any asynchronous logic.
   *
   * @param {Boolean} opt_isResolved Whether to resolve or reject the promise.
   * @param {...*} var_args Arguments to pass with resolutions/rejection.
   * @constructor
   */
  var EmptyPromise = function(opt_isResolved, var_args) {
    var isResolved, args;

    Promise.apply(this);

    // Process constructor params...
    isResolved = opt_isResolved !== false;
    args = Array.prototype.slice.call(arguments, 1);


    // Reject or resolve promise
    if (isResolved) {
      this.resolve.apply(this, args);
    }
    else {
      this.reject.apply(this, args);
    }
  };
  aeris.inherits(EmptyPromise, Promise);


  return EmptyPromise;
});
