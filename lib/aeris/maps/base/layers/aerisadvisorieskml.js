define(['aeris', './kml'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Advisories (KML Format).
   */


  aeris.provide('aeris.maps.layers.AerisAdvisoriesKML');


  /**
   * Representation of Aeris Advisories.
   *
   * @constructor
   * @extends {aeris.maps.layers.KML}
   */
  aeris.maps.layers.AerisAdvisoriesKML = function() {
    aeris.maps.layers.KML.call(this);


    /**
     * @override
     */
    this.url = 'http://gis.hamweather.net/kml/hwadv_all.kml';


    /**
     * @override
     */
    this.zIndex = 0;


    /**
     * @override
     */
    this.autoUpdateInterval = 1000 * 60 * 3;

  };
  aeris.inherits(aeris.maps.layers.AerisAdvisoriesKML, aeris.maps.layers.KML);


  return aeris.maps.layers.AerisAdvisoriesKML;

});
