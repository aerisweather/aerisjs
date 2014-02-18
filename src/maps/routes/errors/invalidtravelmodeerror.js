define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class InvalidTravelModeError
   * @namespace aeris.maps.gmaps.route.errors
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'InvalidTravelModeError'
  });
});
