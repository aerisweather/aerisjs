/**
 * @fileoverview Defined the {aeris.error.AbstractError} class.
 */
define(['aeris/util', 'aeris/errors/abstracterror'], function(_) {
  _.provide('aeris.errors.UnimplementedMethodError');

  /**
   * UnimplementedMethodError class
   * Throw when trying to access an abstract method that has not been implemented.
   *
   * @extends {aeris.errors.AbstractError}
   * @constructor
   */
  aeris.errors.UnimplementedMethodError = function() {
    aeris.errors.AbstractError.apply(this, arguments);
  };
  _.inherits(
    aeris.errors.UnimplementedMethodError,
    aeris.errors.AbstractError
  );


  /**
   * @override
   */
  aeris.errors.UnimplementedMethodError.prototype.setName = function() {
    return 'UnimplementedMethodError';
  };

  return aeris.errors.UnimplementedMethodError;
});
