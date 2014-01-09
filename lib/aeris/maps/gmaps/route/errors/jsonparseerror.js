define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class aeris.maps.gmaps.route.errors.JSONParseError
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'JSONParseError',
    message:function(message) {
      return 'Unable to parse JSON route: ' + message;
    }
  });
});
