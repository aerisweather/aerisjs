define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class aeris.directions.errors.InvalidDirectionsResultsError
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'InvalidDirectionsResultsError'
  });
});
