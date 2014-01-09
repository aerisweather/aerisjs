define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class aeris.errors.APIResponseError
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'APIResponseError'
  });
});