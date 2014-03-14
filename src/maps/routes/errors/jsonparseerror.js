define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class JSONParseError
   * @namespace aeris.maps.gmaps.route.errors
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'JSONParseError',
    message: function(message) {
      return 'Unable to parse JSON route: ' + message;
    }
  });
});
