define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class aeris.maps.gmaps.route.errors.WaypointNotInRouteError
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'WaypointNotInRouteError'
  });
});
