define([
  'aeris/util',
  'aeris/errors/unimplementedmethoderror'
], function(_, UnimplementedMethodError) {
  /**
   * Base validator class.
   *
   * @class AbstractValidator
   * @namespace aeris.helpers.validator
   * @implements aeris.helpers.validator.ValidatorInterface
   *
   * @abstract
   * @constructor
   */
  var AbstractValidator = function() {
    this.lastError_ = null;
  };

  /**
   * @method isValid
   */
  AbstractValidator.prototype.isValid = function() {
    throw new UnimplementedMethodError('ValidatorInterface#isValid');
  };

  /**
   * @method getLastError
   */
  AbstractValidator.prototype.getLastError = function() {
    return this.lastError_;
  };

  /**
   * @private
   * @method clearLastError_
   */
  AbstractValidator.prototype.clearLastError_ = function() {
    this.lastError_ = null;
  };

  /**
   * @private
   * @method setLastError_
   */
  AbstractValidator.prototype.setLastError_ = function(error) {
    this.lastError_ = error;
  };


  return AbstractValidator;
});
