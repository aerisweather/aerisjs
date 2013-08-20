define(['aeris/util', 'base/layer'], function(_) {

  /**
   * @fileoverview Representation of KML layer.
   */


  _.provide('aeris.maps.layers.KML');


  /**
   * Representation of KML layer.
   *
   * @constructor
   * @extends {aeris.maps.Layer}
   */
  aeris.maps.layers.KML = function() {
    aeris.maps.Layer.call(this);
    this.strategy.push('KML');


    /**
     * The url to the KML file.
     *
     * @type {string}
     */
    this.url = null;

  };
  _.inherits(aeris.maps.layers.KML, aeris.maps.Layer);


  return aeris.maps.layers.KML;

});
