define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class aeris.maps.gmaps.route.errors.InvalidTravelModeError
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'InvalidTravelModeError'
  });
});
