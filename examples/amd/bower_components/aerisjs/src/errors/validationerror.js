define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class ValidationError
   * @namespace aeris.errors
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'ValidationError',
    message: function(attrName, opt_errorDetails) {
      return (opt_errorDetails) ?
        'Invalid model attribute \'' + attrName + '\': ' + opt_errorDetails + '.' :
        'Model failed to pass validation: ' + attrName;
    }
  });
});
