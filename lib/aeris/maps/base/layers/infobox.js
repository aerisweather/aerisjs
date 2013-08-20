define(['aeris/util', 'base/layer'], function(_) {

  /**
   * @fileoverview Representation of an Info Box.
   */


  _.provide('aeris.maps.layers.InfoBox');


  /**
   * Representation of an Info Box.
   *
   * @param {Array.<number,number>} latLon The lat/lon of the InfoBox.
   * @param {string} content The content of the InfoBox.
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


    /**
     * Style options for the InfoBox.
     *
     * @type {Object}
     */
    this.style = {
      borderRadius: '10px',
      borderColor: '#4d4d4d',
      backgroundColor: '#e7e7e7',
      headerHeight: '26px',
      headerBackgroundColor: '#4d4d4d',
      closePosition: '6px'
    };

  };
  _.inherits(aeris.maps.layers.InfoBox, aeris.maps.Layer);


  return aeris.maps.layers.InfoBox;

});
