define(['aeris', 'base/layer'], function(aeris) {

  /**
   * @fileoverview Abstract representation of a Google MapType layer.
   */


  aeris.provide('aeris.maps.layers.GoogleMapType');


  /**
   * An abstract representation of a Google MapType layer.
   *
   * @constructor
   * @extends {aeris.maps.Layer}
   */
  aeris.maps.layers.GoogleMapType = function() {


    /**
     * The constant representing the Google Map Type.
     *
     * @type {google.maps.MapTypeId}
     */
    this.mapTypeId = null;


    /**
     * @override
     */
    this.strategy = 'GoogleMapType';

  };
  aeris.inherits(aeris.maps.layers.GoogleMapType, aeris.maps.Layer);


  return aeris.maps.layers.GoogleMapType;

});
