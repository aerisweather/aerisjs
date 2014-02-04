define([
  'ai/util',
  'ai/maps/strategy/layerstrategies/abstractlayerstrategy'
], function(_, AbstractLayerStrategy) {
  /**
   * A strategy for rendering an OSM layer with OpenLayers.
   *
   * @constructor
   * @class OSMStrategy
   * @namespace aeris.maps.openlayers.layerstrategies
   * @extends aeris.maps.openlayers.layerstrategies.AbstractLayerStrategy
   */
  var OSMStrategy = function(layer) {
    AbstractLayerStrategy.call(this, layer);

    /**
     * @override
     * @property isBaseLayer_
     */
    this.isBaseLayer_ = true;
  };
  _.inherits(OSMStrategy, AbstractLayerStrategy);


  /**
   * @override
   * @method createView_
   */
  OSMStrategy.prototype.createView_ = function() {
    return new OpenLayers.Layer.OSM(
      this.object_.get('name'),
      null,
      {
        transitionEffect: 'resize'
      }
    );
  };


  return OSMStrategy;
});
