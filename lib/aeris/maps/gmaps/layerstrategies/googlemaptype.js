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
  aeris.maps.gmaps.layerstrategies.GoogleMapType = function(aerisMap) {


    aeris.maps.LayerStrategy.call(this, aerisMap);

  };
  aeris.inherits(aeris.maps.gmaps.layerstrategies.GoogleMapType,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.GoogleMapType.prototype.setBaseLayer =
      function(layer) {
    this.map.setMapTypeId(layer.mapTypeId);
  };


  return aeris.maps.gmaps.layerstrategies.GoogleMapType;

});
