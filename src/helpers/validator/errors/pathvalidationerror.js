define([
  'aeris/errors/errortypefactory',
  'aeris/errors/validationerror'
], function(ErrorTypeFactory, ValidationError) {
  /**
   * @class aeris.helpers.validator.errors.PathValidationError
   * @extends aeris.errors.ValidationError
  */
  return new ErrorTypeFactory({
    name: 'PathValidationError',
    type: ValidationError
  });
});
