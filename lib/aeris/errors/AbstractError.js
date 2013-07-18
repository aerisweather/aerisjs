/**
 * @fileoverview Defines {aeris.errors.AbstractError}.
 */
define(['aeris'], function(aeris) {
  aeris.provide('aeris.errors.AbstractError');

  /**
   * A custom Error.
   * Note that Javascript does not allow "extending" the native Error class
   * (`CustomError.prototype = new Error();` will throw an error...)
   * But an error instance is nothing but an object with a name and message property.
   *
   * @abstract
   * @param {string} message Error message
   * @constructor
   */
  aeris.errors.AbstractError = function(message) {
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


  /**
   * Set the name of the error.
   *
   * @abstract
   * @return {string} Error name.
   */
  aeris.errors.AbstractError.prototype.setName = function() {
    // Cannot throw UnimplementedMethodError without a circular dependency
    // So we'll fake it
    throw {
      name: 'UnimplementedMethodError',
      message: 'Classes extending from AbstractError must implement setName method'
    };
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
});
