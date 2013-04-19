define(['aeris', 'base/layer'], function(aeris) {

  /**
   * @fileoverview Representation of OpenStreetMaps layer.
   */


  aeris.provide('aeris.maps.layers.OSM');


  /**
   * Representation of OpenStreetMaps layer.
   */
  aeris.maps.layers.OSM = function() {


    /**
     * @override
     */
    this.strategy = 'OSM';

  };
  aeris.inherits(aeris.maps.layers.OSM, aeris.maps.Layer);


  return aeris.maps.layers.OSM;

});

