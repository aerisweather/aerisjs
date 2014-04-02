define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class ServiceUnavailableError
   * @namespace aeris.directions.errors
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'ServiceUnavailableError'
  });
});
