define(['aeris', 'base/layermanagerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting a GoogleMapType layer
   *               for Google Maps.
   */


  aeris.provide('aeris.maps.gmaps.layermanager.GoogleMapType');


  /**
   * A strategy for supporting GoogleMapType layers with Google Maps.
   *
   * @constructor
   * @extends {aeris.maps.LayerManagerStrategy}
   */
  aeris.maps.gmaps.layermanager.GoogleMapType = function(aerisMap) {


    aeris.maps.LayerManagerStrategy.call(this, aerisMap);

  };
  aeris.inherits(aeris.maps.gmaps.layermanager.GoogleMapType,
                 aeris.maps.LayerManagerStrategy);


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.GoogleMapType.prototype.setBaseLayer =
      function(layer) {
    this.map.setMapTypeId(layer.mapTypeId);
  };


  return aeris.maps.gmaps.layermanager.GoogleMapType;

});
