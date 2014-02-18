define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class InvalidDirectionsResultsError
   * @namespace aeris.directions.errors
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'InvalidDirectionsResultsError'
  });
});
