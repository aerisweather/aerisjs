define(['aeris', './googlemaptype'], function(aeris) {

  /**
   * @fileoverview Representation of Google's Terrain.
   */


  aeris.provide('aeris.maps.layers.GoogleTerrain');


  /**
   * Representation of Google's Terrain.
   *
   * @constructor
   * @extends {aeris.maps.layers.GoogleMapType}
   */
  aeris.maps.layers.GoogleTerrain = function() {

    aeris.maps.layers.GoogleMapType.call(this);


    /**
     * @override
     */
    this.mapTypeId = google.maps.MapTypeId.TERRAIN;

  };
  aeris.inherits(aeris.maps.layers.GoogleTerrain,
                 aeris.maps.layers.GoogleMapType);


  return aeris.maps.layers.GoogleTerrain;

});
