define([
  'aeris/util',
  'aeris/errors/abstracterror'
], function(_, AbstractError) {
  /**
   * @class aeris.maps.gmaps.route.errors.WaypointNotInRouteError
   *
   * @constructor
   * @override
   */
  var WaypointNotInRouteError = function(message) {
    AbstractError.apply(this, arguments);
  };
  _.inherits(WaypointNotInRouteError, AbstractError);


  /**
   * @override
   */
  WaypointNotInRouteError.prototype.setName = function() {
    return 'WaypointNotInRouteError';
  };


  return _.expose(WaypointNotInRouteError, 'aeris.maps.gmaps.route.errors.WaypointNotInRouteError');
});
