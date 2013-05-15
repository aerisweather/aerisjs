define(['aeris', './kml'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Advisories.
   */


  aeris.provide('aeris.maps.layers.AerisAdvisories');


  /**
   * Representation of Aeris Advisories.
   *
   * @constructor
   * @extends {aeris.maps.layers.KML}
   */
  aeris.maps.layers.AerisAdvisories = function() {
    aeris.maps.layers.KML.call(this);


    /**
     * @override
     */
    this.url = 'http://gis.hamweather.net/kml/hwadv_all.kml';

  };
  aeris.inherits(aeris.maps.layers.AerisAdvisories, aeris.maps.layers.KML);


  return aeris.maps.layers.AerisAdvisories;

});
