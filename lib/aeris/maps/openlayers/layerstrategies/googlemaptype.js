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
  aeris.maps.openlayers.layerstrategies.GoogleMapType = function(aerisMap) {


    aeris.maps.LayerStrategy.call(this, aerisMap);

  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.GoogleMapType,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.GoogleMapType.prototype.setBaseLayer =
      function(layer) {
    if (!layer.openlayers_) {
      layer.openlayers_ = new OpenLayers.Layer.Google(
        layer.name,
        {
          type: layer.mapTypeId
        }
      );
    }

    this.map.addLayer(layer.openlayers_);
    this.map.setBaseLayer(layer.openlayers_);
  };


  return aeris.maps.openlayers.layerstrategies.GoogleMapType;

});
