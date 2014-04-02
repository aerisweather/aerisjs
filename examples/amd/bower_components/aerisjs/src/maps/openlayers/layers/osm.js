define([
  'aeris/util',
  'aeris/maps/strategy/layers/layerstrategy'
], function(_, LayerStrategy) {
  /**
   * A strategy for rendering an OSM layer with OpenLayers.
   *
   * @constructor
   * @class OSMStrategy
   * @namespace aeris.maps.openlayers.layers
   * @extends aeris.maps.openlayers.layers.LayerStrategy
   */
  var OSMStrategy = function(layer) {
    LayerStrategy.call(this, layer);

    /**
     * @override
     * @property isBaseLayer_
     */
    this.isBaseLayer_ = true;
  };
  _.inherits(OSMStrategy, LayerStrategy);


  /**
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
