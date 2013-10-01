define([
  'aeris/util',
  'strategy/layerstrategies/tile'
], function(_, BaseTileStrategy) {
  /**
   * A strategy for rendering a Tile layer with OpenLayers.
   *
   * @constructor
   * @class aeris.maps.openlayers.layerstrategies.AerisInteractiveTileStrategy
   * @extends aeris.maps.openlayers.layerstrategies.AbstractLayerStrategy
   */
  var AerisInteractiveTileStrategy = function(layer) {
    BaseTileStrategy.call(this, layer);
  };
  _.inherits(AerisInteractiveTileStrategy, BaseTileStrategy);


  /**
   * Returns tile urls, including the
   * timestamp corresponding to the layer's time.
   *
   * @override
   */
  AerisInteractiveTileStrategy.prototype.getTileUrls_ = function() {
    var urls = BaseTileStrategy.prototype.getTileUrls_.call(this);

    _.each(urls, function(thisUrl, n) {
      urls[n] = thisUrl.replace(/\{t\}/, this.layer_.getAerisTimeString());
    }, this);

    return urls;
  };


  return AerisInteractiveTileStrategy;
});
