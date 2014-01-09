define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class aeris.errors.TimeoutError
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'TimeoutError'
  });
});
