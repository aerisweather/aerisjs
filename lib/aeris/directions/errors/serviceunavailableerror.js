define([
  'errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class aeris.directions.errors.ServiceUnavailableError
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'ServiceUnavailableError'
  });
});
