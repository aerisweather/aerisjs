define(['aeris/util', 'base/layers/googlemaptype'], function(_) {

  /**
   * @fileoverview Representation of Google's Terrain.
   */


  _.provide('aeris.maps.layers.GoogleTerrain');


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


    /**
     * @override
     */
    this.name = 'GoogleTerrain';

  };
  _.inherits(aeris.maps.layers.GoogleTerrain,
                 aeris.maps.layers.GoogleMapType);


  return aeris.maps.layers.GoogleTerrain;

});
