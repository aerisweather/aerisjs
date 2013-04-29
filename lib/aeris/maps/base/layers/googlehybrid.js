define(['aeris', './googlemaptype'], function(aeris) {

  /**
   * @fileoverview Representation of Google's Hybrid.
   */


  aeris.provide('aeris.maps.layers.GoogleHybrid');


  /**
   * Representation of Google's Hybrid.
   *
   * @constructor
   * @extends {aeris.maps.layers.GoogleMapType}
   */
  aeris.maps.layers.GoogleHybrid = function() {

    aeris.maps.layers.GoogleMapType.call(this);


    /**
     * @override
     */
    this.mapTypeId = google.maps.MapTypeId.HYBRID;


    /**
     * @override
     */
    this.name = 'GoogleHybrid';

  };
  aeris.inherits(aeris.maps.layers.GoogleHybrid,
                 aeris.maps.layers.GoogleMapType);


  return aeris.maps.layers.GoogleHybrid;

});
