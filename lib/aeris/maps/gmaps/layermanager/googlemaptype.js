define(['aeris', 'base/layermanagerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting a GoogleMapType layer
   *               for Google Maps.
   */


  aeris.provide('aeris.maps.gmaps.layermanager.GoogleMapType');


  /**
   * A strategy for supporting GoogleMapType layers with Google Maps.
   *
   * @const
   */
  aeris.maps.gmaps.layermanager.GoogleMapType = {};


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.GoogleMapType.setBaseLayer =
      function(map, layer) {
    map.setMapTypeId(layer.mapTypeId);
  };


  return aeris.maps.gmaps.layermanager.GoogleMapType;

});
