define([
  'aeris/util',
  'errors/unimplementedmethoderror'
], function(_, UnimplementedMethodError) {
  /**
   * Base validator class.
   *
   * @class aeris.helpers.validator.AbstractValidator
   * @implements aeris.helpers.validator.ValidatorInterface
   *
   * @abstract
   * @constructor
   */
  var AbstractValidator = function() {
    this.lastError_ = null;
  };

  /** @override */
  AbstractValidator.prototype.isValid = function() {
    throw new UnimplementedMethodError('ValidatorInterface#isValid');
  };

  /** @override */
  AbstractValidator.prototype.getLastError = function() {
    return this.lastError_;
  };

  /** @private */
  AbstractValidator.prototype.clearLastError_ = function() {
    this.lastError_ = null;
  };

  /** @private */
  AbstractValidator.prototype.setLastError_ = function(error) {
    this.lastError_ = error;
  };


  return AbstractValidator;
});
