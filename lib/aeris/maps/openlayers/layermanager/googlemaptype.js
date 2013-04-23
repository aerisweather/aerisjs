define(['aeris', 'base/layermanagerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting a GoogleMapType layer
   *               with OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.layermanager.GoogleMapType');


  /**
   * A strategy for supporting GoogleMapType layers with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.LayerManagerStrategy}
   */
  aeris.maps.openlayers.layermanager.GoogleMapType = function(aerisMap) {


    aeris.maps.LayerManagerStrategy.call(this, aerisMap);

  };
  aeris.inherits(aeris.maps.openlayers.layermanager.GoogleMapType,
                 aeris.maps.LayerManagerStrategy);


  /**
   * @override
   */
  aeris.maps.openlayers.layermanager.GoogleMapType.prototype.setBaseLayer =
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


  return aeris.maps.openlayers.layermanager.GoogleMapType;

});
