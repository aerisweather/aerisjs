define([
  'aeris/util',
  'base/abstractstrategy'
], function(_, BaseStrategy) {
  /**
   * A AbstractLayerStrategy class mediates all interaction
   * between an {aeris.maps.AbstractLayer} and the actual map
   * view (ie. the map rendering API -- Google, OpenLayers, etc.)
   *
   * @class aeris.maps.layerstrategies.AbstractLayerStrategy
   * @extends aeris.maps.AbstractStrategy
   * @constructor
   */
  var AbstractLayerStrategy = function(layer) {
    /**
     * @type {aeris.maps.AbstractLayer}
     * @protected
     */
    this.layer_ = layer;

    BaseStrategy.apply(this, arguments);
  };

  _.inherits(AbstractLayerStrategy, BaseStrategy);


  return AbstractLayerStrategy;
});
