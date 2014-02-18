define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class UnimplementedPropertyError
   * @namespace aeris.errors
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'UnimplementedPropertyError',
    message: function(message) {
      return message ?
        'Abstract property ' + message + ' has not been implemented' :
        'Abstract property has not been implemented';
    }
  });
});
