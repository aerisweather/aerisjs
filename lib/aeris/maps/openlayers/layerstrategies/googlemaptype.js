define(['aeris', 'base/layerstrategy'], function(aeris) {

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
   */
  aeris.maps.openlayers.layerstrategies.GoogleMapType = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.GoogleMapType,
                 aeris.maps.LayerStrategy);


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


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.GoogleMapType.prototype.
      registerInstanceLayer = function(instanceLayer, map) {
    map.addLayer(instanceLayer);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.GoogleMapType.prototype.
      setBaseInstanceLayer = function(instanceLayer, map) {
    map.setBaseLayer(instanceLayer);
  }


  return aeris.maps.openlayers.layerstrategies.GoogleMapType;

});
