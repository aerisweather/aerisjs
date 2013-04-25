define(['aeris', 'base/layerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting a GoogleMapType layer
   *               for Google Maps.
   */


  aeris.provide('aeris.maps.gmaps.layerstrategies.GoogleMapType');


  /**
   * A strategy for supporting GoogleMapType layers with Google Maps.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   */
  aeris.maps.gmaps.layerstrategies.GoogleMapType =
      function(aerisMap, layer, data) {


    aeris.maps.LayerStrategy.call(this, aerisMap, layer, data);

  };
  aeris.inherits(aeris.maps.gmaps.layerstrategies.GoogleMapType,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.GoogleMapType.prototype.setBaseLayer =
      function() {
    this.map.setMapTypeId(this.layer.mapTypeId);
  };


  return aeris.maps.gmaps.layerstrategies.GoogleMapType;

});
