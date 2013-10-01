define([
  'aeris/util',
  'strategy/layerstrategies/abstractlayerstrategy'
], function(_, AbstractLayerStrategy) {
  /**
   * A strategy for rendering an OSM layer with OpenLayers.
   *
   * @constructor
   * @class aeris.maps.openlayers.layerstrategies.OSMStrategy
   * @extends aeris.maps.openlayers.layerstrategies.AbstractLayerStrategy
   */
  var OSMStrategy = function(layer) {
    AbstractLayerStrategy.call(this, layer);

    /**
     * @override
     */
    this.isBaseLayer_ = true;
  };
  _.inherits(OSMStrategy, AbstractLayerStrategy);


  /**
   * @override
   */
  OSMStrategy.prototype.createView_ = function() {
    return new OpenLayers.Layer.OSM(
      this.layer_.get('name'),
      null,
      {
        transitionEffect: 'resize'
      }
    );
  };


  return OSMStrategy;
});
