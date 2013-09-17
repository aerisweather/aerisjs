/**
 * @fileoverview Defines {aeris.errors.AbstractError}.
 */
define(['aeris/util'], function(_) {
  _.provide('aeris.errors.AbstractError');

  /**
   * A custom Error.
   * Note that Javascript does not allow "extending" the native Error class
   * (`CustomError.prototype = new Error();` will throw an error...)
   * But an error instance is nothing but an object with a name and message property.
   *
   * @abstract
   * @param {string} message Error message.
   * @constructor
   * @class aeris.errors.AbstractError
   */
  aeris.errors.AbstractError = function(message) {
    // See note above _.inherits.
    try {
      window.Error.call(this);
      Error.captureStackTrace(this, aeris.errors.AbstractError);
    } catch (e) {}

    /**
     * The error's name. Should equal the class name, by convention.
     * @type {string}
     */
    this.name = this.setName();

    /**
     * The error message to throw.
     * @type {string}
     */
    this.message = this.setMessage(message);
  };

  // Note: inheriting from the Error object may throw errors
  //  in some browsers (or so I'm told).
  //  This custom error will work either way, though
  //  with reduced functionality.
  try {
    _.inherits(
      aeris.errors.AbstractError,
      window.Error
    );
  } catch (e) {}


  /**
   * Set the name of the error.
   *
   * @abstract
   * @return {string} Error name.
   */
  aeris.errors.AbstractError.prototype.setName = function() {
    // Cannot throw UnimplementedMethodError without a circular dependency
    // So we'll fake it
    throw 'UnimplementedMethodError: Classes extending from AbstractError must implement setName method';
  };


  /**
   * Set the error message
   *
   * @param {string} message Message passed into constructor.
   * @return {string} Error message.
   */
  aeris.errors.AbstractError.prototype.setMessage = function(message) {
    return message;
  };


  /**
   * Determines how error is displayed in (some) browser consoles
   *
   * @return {string}
   */
  aeris.errors.AbstractError.prototype.toString = function() {
    return this.name + ':' + this.message;
  };

  return aeris.errors.AbstractError;
});
