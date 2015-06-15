define([
  'aeris/util',
  'aeris/maps/abstractstrategy'
], function(_, AbstractStrategy) {
  var StormCells = function(mapObject) {
    AbstractStrategy.call(this, mapObject);
  };
  _.inherits(StormCells, AbstractStrategy);

  StormCells.prototype.createView_ = function() {
    throw new Error('Aeris.js does not currently support StormCells using Google Maps.');
  };
});
