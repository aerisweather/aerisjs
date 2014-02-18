define(['aeris/util'], function(_) {
  /**
   * A custom Error.
   *
   * @abstract
   * @param {string} message Error message.
   * @constructor
   * @class AbstractError
   * @namespace aeris.errors
   */
  AbstractError = function(message) {
    // See note above _.inherits.
    try {
      window.Error.call(this);
      Error.captureStackTrace(this, AbstractError);
    } catch (e) {}

    /**
     * The error's name. Should equal the class name, by convention.
     * @type {string}
     * @property name
     */
    this.name = this.setName();

    /**
     * The error message to throw.
     * @type {string}
     * @property message
     */
    this.message = this.setMessage.apply(this, arguments);
  };

  // Note: inheriting from the Error object may throw errors
  //  in some browsers (or so I'm told).
  //  This custom error will work either way, though
  //  with reduced functionality.
  try {
    _.inherits(
      AbstractError,
      window.Error
    );
  } catch (e) {}


  /**
   * Set the name of the error.
   *
   * @abstract
   * @return {string} Error name.
   * @method setName
   */
  AbstractError.prototype.setName = function() {
    // Cannot throw UnimplementedMethodError without a circular dependency
    // So we'll fake it
    throw 'UnimplementedMethodError: Classes extending from AbstractError must implement setName method';
  };


  /**
   * Set the error message
   *
   * @param {string} message Message passed into constructor.
   * @return {string} Error message.
   * @method setMessage
   */
  AbstractError.prototype.setMessage = function(message) {
    return message;
  };


  /**
   * Determines how error is displayed in (some) browser consoles
   *
   * @return {string}
   * @method toString
   */
  AbstractError.prototype.toString = function() {
    return this.name + ':' + this.message;
  };


  return _.expose(AbstractError, 'aeris.errors.AbstractError');
});
