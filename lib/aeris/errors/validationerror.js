define([
  'aeris/util',
  'aeris/errors/abstracterror'
], function(_, AbstractError) {
  /**
   * Thrown when a model fails validation.
   *
   * @param {string} attrName Name of the attribute failing validation.
   * @param {string=} opt_errorDetails
   *                  Details about the failed validation.
   *                  If this parameter is excluded, the first
   *                  parameter can be used to specify an error message.
   *
   * @extends aeris.errors.AbstractError
   * @class aeris.errors.ValidationError
   * @constructor
   */
  var ValidationError = function(attrName, opt_errorDetails) {
    AbstractError.apply(this, arguments);

    /**
     * @override
     */
    this.message = this.setMessage(attrName, opt_errorDetails);
  };

  _.inherits(ValidationError, AbstractError);


  /**
   * @override
   */
  ValidationError.prototype.setName = function() {
    return 'ValidationError';
  };


  /**
   * @param {string} attrName Name of the attribute failing validation.
   * @param {string=} opt_errorDetails
   *                  Details about the failed validation.
   *                  If this parameter is excluded, the first
   *                  parameter can be used to specify an error message.
   *
   * @override
   */
  ValidationError.prototype.setMessage = function(attrName, opt_errorDetails) {
    return (opt_errorDetails) ?
      'Invalid model attribute \'' + attrName + '\': ' + opt_errorDetails + '.' :
      'Model failed to pass validation: ' + attrName;
  };

  return ValidationError;
});
