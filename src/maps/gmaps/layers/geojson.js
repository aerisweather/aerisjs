define([
  'aeris/util',
  'aeris/maps/abstractstrategy'
], function(_, AbstractStrategy) {
  var GeoJson = function(mapObject) {
    AbstractStrategy.call(this, mapObject);
  };
  _.inherits(GeoJson, AbstractStrategy);

  GeoJson.prototype.createView_ = function() {
    throw new Error('Aeris.js does not currently support GeoJson views using Google Maps.');
  };

  return GeoJson;
});
