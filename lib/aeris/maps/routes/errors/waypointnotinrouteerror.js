define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class WaypointNotInRouteError
   * @namespace aeris.maps.gmaps.route.errors
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'WaypointNotInRouteError'
  });
});
