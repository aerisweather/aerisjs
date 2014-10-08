define([
  'aeris/util',
  'aeris/maps/strategy/layers/tile'
], function(_, Tile) {
  /**
   * Rendering strategy for Aeris Tiles.
   *
   * @class AerisTile
   * @namespace aeris.maps.leaflet.layers
   * @extends aeris.maps.leaflet.layers.Tile
   *
   * @constructor
  */
  var AerisTileStrategy = function(mapObject) {
    Tile.call(this, mapObject);
  };
  _.inherits(AerisTileStrategy, Tile);


  /**
   * @method getTileUrl_
   */
  AerisTileStrategy.prototype.getTileUrl_ = function() {
    var url = Tile.prototype.getTileUrl_.call(this);

    return url.replace('{t}', this.object_.getAerisTimeString());
  };


  return AerisTileStrategy;
});
