define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class APIResponseError
   * @namespace aeris.errors
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'APIResponseError'
  });
});
