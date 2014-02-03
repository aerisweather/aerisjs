define([
  'ai/errors/errortypefactory',
  'ai/errors/validationerror'
], function(ErrorTypeFactory, ValidationError) {
  /**
   * @class PathValidationError
   * @namespace aeris.helpers.validator.errors
   * @extends aeris.errors.ValidationError
  */
  return new ErrorTypeFactory({
    name: 'PathValidationError',
    type: ValidationError
  });
});
