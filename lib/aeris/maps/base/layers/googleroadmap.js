define(['aeris/util', 'base/layers/googlemaptype'], function(_) {

  /**
   * @fileoverview Representation of Google's RoadMap.
   */


  _.provide('aeris.maps.layers.GoogleRoadMap');


  /**
   * Representation of Google's RoadMap.
   *
   * @constructor
   * @class aeris.maps.layers.GoogleRoadMap
   * @extends {aeris.maps.layers.GoogleMapType}
   */
  aeris.maps.layers.GoogleRoadMap = function() {

    aeris.maps.layers.GoogleMapType.call(this);


    /**
     * @override
     */
    this.mapTypeId = google.maps.MapTypeId.ROADMAP;


    /**
     * @override
     */
    this.name = 'GoogleRoadMap';

  };
  _.inherits(aeris.maps.layers.GoogleRoadMap,
                 aeris.maps.layers.GoogleMapType);


  return aeris.maps.layers.GoogleRoadMap;

});
