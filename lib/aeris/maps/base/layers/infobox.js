define([
  'aeris/util',
  'aeris/events',
  'base/layer'
], function(_, Events) {

  /**
   * @fileoverview Representation of an Info Box.
   */


  _.provide('aeris.maps.layers.InfoBox');


  /**
   * Representation of an Info Box.
   *
   * @param {Array.<number,number>} latLon The lat/lon of the InfoBox.
   * @param {string} content The content of the InfoBox.
   * @param {Object=} opt_options
   * @param {Boolean=} opt_options.hideMarker
   *                   Optionally hide the marker associated
   *                   with this infobox. Default: false.
   *
   * @class aeris.maps.layers.InfoBox
   * @constructor
   * @extends {aeris.maps.Layer}
   */
  aeris.maps.layers.InfoBox = function(latLon, content, opt_options) {
    var options = _.extend({
      hideMarker: false
    }, opt_options);

    aeris.maps.Layer.call(this);
    Events.call(this);
    this.strategy.push('InfoBox');

    /**
     * @type {Object}
     * @property {Boolean} hideMarker
     */
    this.options = options;

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
  _.inherits(aeris.maps.layers.InfoBox, aeris.maps.Layer);
  _.extend(aeris.maps.layers.InfoBox.prototype, Events.prototype);


  return aeris.maps.layers.InfoBox;

});
