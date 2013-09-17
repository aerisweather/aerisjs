/**
 * @fileoverview Defined custom {aeris.errors.InvalidArgumentError} error class.
 */
define(['aeris/util', 'aeris/errors/abstracterror'], function(_) {
  _.provide('aeris.errors.InvalidArgumentError');


  /**
   * Error thrown for invalid method arguments
   *
   * @extends {aeris.errors.AbstractError}
   * @constructor
   * @class aeris.errors.InvalidArgumentError
   */
  aeris.errors.InvalidArgumentError = function() {
    aeris.errors.AbstractError.apply(this, arguments);
  };

  _.inherits(
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

