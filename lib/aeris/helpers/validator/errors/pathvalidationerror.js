define([
  'aeris/util',
  'aeris/errors/validationerror'
], function(_, ValidationError) {
  /**
   * @class aeris.helpers.validator.errors.PathValidationError
   * @extends aeris.errors.ValidationError
   *
   * @constructor
   * @override
  */
  var PathValidationError = function() {
    ValidationError.apply(this, arguments);
  };
  _.inherits(PathValidationError, ValidationError);

  /** @override */
  PathValidationError.prototype.setName = function() {
    return 'PathValidationError';
  };


  return PathValidationError;
});
