define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class aeris.errors.MissingApiKeysError
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'MissingApiKeyError'
  });
});
