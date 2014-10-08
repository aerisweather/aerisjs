define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class UntestedSpecError
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'UntestedSpecError',
    message: function(message) {
      return message || 'Spec has not yet been tested';
    }
  });
});
