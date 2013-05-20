define(['aeris', 'base/layer'], function(aeris) {

  /**
   * @fileoverview Representation of an Info Box.
   */


  aeris.provide('aeris.maps.layers.InfoBox');


  /**
   * Representation of an Info Box.
   *
   * @constructor
   * @extends {aeris.maps.Layer}
   */
  aeris.maps.layers.InfoBox = function(latLon, content) {
    aeris.maps.Layer.call(this);
    this.strategy.push('InfoBox');


    /**
     * @override
     */
    this.name = 'InfoBox';


    /**
     * The lat/lon position to place the info box.
     *
     * @type {Array.<number,number>}
     */
    this.latLon = latLon;


    /**
     * The HTML content to display in the info box.
     *
     * @type {string}
     */
    this.content = content;

  };
  aeris.inherits(aeris.maps.layers.InfoBox, aeris.maps.Layer);


  return aeris.maps.layers.InfoBox;

});
