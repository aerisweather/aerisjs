define(['aeris', 'base/layerstrategy', './mixins/default'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting a GoogleMapType layer
   *               with OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.layerstrategies.GoogleMapType');


  /**
   * A strategy for supporting GoogleMapType layers with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   * @extends {aeris.maps.openlayers.layerstrategies.mixins.Default}
   */
  aeris.maps.openlayers.layerstrategies.GoogleMapType = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.GoogleMapType,
                 aeris.maps.LayerStrategy);
  aeris.extend(aeris.maps.openlayers.layerstrategies.GoogleMapType.prototype,
               aeris.maps.openlayers.layerstrategies.mixins.Default);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.GoogleMapType.prototype.
      createInstanceLayer = function(layer) {
    var instanceLayer = new OpenLayers.Layer.Google(
      layer.name,
      {
        type: layer.mapTypeId
      });
    return instanceLayer;
  };


  return aeris.maps.openlayers.layerstrategies.GoogleMapType;

});
