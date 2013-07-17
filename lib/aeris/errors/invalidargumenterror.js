/**
 * @fileoverview Defined custom {aeris.errors.InvalidArgumentError} error class.
 */
define(['aeris', 'aeris/errors/AbstractError'], function(aeris) {
  aeris.provide('aeris.errors.InvalidArgumentError');


  /**
   * Error thrown for invalid method arguments
   *
   * @extends {aeris.errors.AbstractError}
   * @constructor
   */
  aeris.errors.InvalidArgumentError = function() {
    aeris.errors.AbstractError.apply(this, arguments);
  };

  aeris.inherits(
    aeris.errors.InvalidArgumentError,
    aeris.errors.AbstractError
  );


  /**
   * @override
   */
  aeris.errors.InvalidArgumentError.prototype.setName = function() {
    return 'InvalidArgumentError';
  };


  return aeris.errors.InvalidArgumentError;
});

