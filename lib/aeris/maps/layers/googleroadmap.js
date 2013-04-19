define(['aeris', './googlemaptype'], function(aeris) {

  /**
   * @fileoverview Representation of Google's RoadMap.
   */


  aeris.provide('aeris.maps.layers.GoogleRoadMap');


  /**
   * Representation of Google's RoadMap.
   *
   * @constructor
   * @extends {aeris.maps.layers.GoogleMapType}
   */
  aeris.maps.layers.GoogleRoadMap = function() {

    aeris.maps.layers.GoogleMapType.call(this);


    /**
     * @override
     */
    this.mapTypeId = google.maps.MapTypeId.ROADMAP;

  };
  aeris.inherits(aeris.maps.layers.GoogleRoadMap,
                 aeris.maps.layers.GoogleMapType);


  return aeris.maps.layers.GoogleRoadMap;

});
