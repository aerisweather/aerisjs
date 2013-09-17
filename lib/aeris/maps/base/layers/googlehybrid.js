define(['aeris/util', 'base/layers/googlemaptype'], function(_) {

  /**
   * @fileoverview Representation of Google's Hybrid.
   */


  _.provide('aeris.maps.layers.GoogleHybrid');


  /**
   * Representation of Google's Hybrid.
   *
   * @constructor
   * @class aeris.maps.layers.GoogleHybrid
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
  _.inherits(aeris.maps.layers.GoogleHybrid,
                 aeris.maps.layers.GoogleMapType);


  return aeris.maps.layers.GoogleHybrid;

});
