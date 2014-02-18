define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class UnimplementedInterfaceError
   * @namespace aeris.errors
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'UnimplementedInterfaceError',
    message: function(message) {
      return message ?
        'Abstract property ' + message + ' has not been implemented' :
        'Interface has not been fully implemented.';
    }
  });
});
