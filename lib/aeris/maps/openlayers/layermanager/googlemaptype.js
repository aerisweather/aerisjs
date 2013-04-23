define(['aeris', 'base/layermanagerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting a GoogleMapType layer
   *               with OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.layermanager.GoogleMapType');


  /**
   * A strategy for supporting GoogleMapType layers with OpenLayers.
   *
   * @const
   */
  aeris.maps.openlayers.layermanager.GoogleMapType = {};


  /**
   * @override
   */
  aeris.maps.openlayers.layermanager.GoogleMapType.setBaseLayer =
      function(map, layer) {
    if (!layer.openlayers_) {
      layer.openlayers_ = new OpenLayers.Layer.Google(
        layer.name,
        {
          type: layer.mapTypeId
        }
      );
    }

    map.addLayer(layer.openlayers_);
    map.setBaseLayer(layer.openlayers_);
  };


  return aeris.maps.openlayers.layermanager.GoogleMapType;

});
