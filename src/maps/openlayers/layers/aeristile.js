define([
  'aeris/util',
  'aeris/maps/strategy/layers/tile'
], function(_, BaseTileStrategy) {
  /**
   * A strategy for rendering a Tile layer with OpenLayers.
   *
   * @constructor
   * @class AerisTile
   * @namespace aeris.maps.openlayers.layers
   * @extends aeris.maps.openlayers.layers.AbstractLayerStrategy
   */
  var AerisTileStrategy = function(layer) {
    BaseTileStrategy.call(this, layer);
  };
  _.inherits(AerisTileStrategy, BaseTileStrategy);


  /**
   * Returns tile urls, including the
   * timestamp corresponding to the layer's time.
   *
   * @override
   * @method getTileUrls_
   */
  AerisTileStrategy.prototype.getTileUrls_ = function() {
    var urls = BaseTileStrategy.prototype.getTileUrls_.call(this);

    _.each(urls, function(thisUrl, n) {
      urls[n] = thisUrl.replace(/\{t\}/, this.object_.getAerisTimeString());
    }, this);

    return urls;
  };


  return AerisTileStrategy;
});
