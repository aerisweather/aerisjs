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
  aeris.maps.openlayers.layerstrategies.GoogleMapType =
      function(aerisMap, layer, data) {


    aeris.maps.LayerStrategy.call(this, aerisMap, layer, data);

  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.GoogleMapType,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.GoogleMapType.prototype.setBaseLayer =
      function() {
    if (!this.getData('olmap')) {
      this.setData('olmap', new OpenLayers.Layer.Google(
        this.layer.name,
        {
          type: this.layer.mapTypeId
        }
      ));
    }

    var olmap = this.getData('olmap');
    this.map.addLayer(olmap);
    this.map.setBaseLayer(olmap);
  };


  return aeris.maps.openlayers.layerstrategies.GoogleMapType;

});
