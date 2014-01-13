define([
  'errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class aeris.errors.UnimplementedPropertyError
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
