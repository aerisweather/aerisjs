define(['aeris/util', 'base/layers/googlemaptype'], function(_) {

  /**
   * @fileoverview Representation of Google's Satellite.
   */


  _.provide('aeris.maps.layers.GoogleSatellite');


  /**
   * Representation of Google's Satellite.
   *
   * @constructor
   * @extends {aeris.maps.layers.GoogleMapType}
   */
  aeris.maps.layers.GoogleSatellite = function() {

    aeris.maps.layers.GoogleMapType.call(this);


    /**
     * @override
     */
    this.mapTypeId = google.maps.MapTypeId.SATELLITE;


    /**
     * @override
     */
    this.name = 'GoogleSatellite';

  };
  _.inherits(aeris.maps.layers.GoogleSatellite,
                 aeris.maps.layers.GoogleMapType);


  return aeris.maps.layers.GoogleSatellite;

});
