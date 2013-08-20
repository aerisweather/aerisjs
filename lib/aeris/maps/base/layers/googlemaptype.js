define(['aeris/util', 'base/layer'], function(_) {

  /**
   * @fileoverview Abstract representation of a Google MapType layer.
   */


  _.provide('aeris.maps.layers.GoogleMapType');


  /**
   * An abstract representation of a Google MapType layer.
   *
   * @constructor
   * @extends {aeris.maps.Layer}
   */
  aeris.maps.layers.GoogleMapType = function() {


    aeris.maps.Layer.call(this);


    /**
     * The constant representing the Google Map Type.
     *
     * @type {google.maps.MapTypeId}
     */
    this.mapTypeId = null;


    this.strategy.push('GoogleMapType');

  };
  _.inherits(aeris.maps.layers.GoogleMapType, aeris.maps.Layer);


  return aeris.maps.layers.GoogleMapType;

});
