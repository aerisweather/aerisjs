define(['aeris', 'base/layer'], function(aeris) {

  /**
   * @fileoverview Representation of KML layer.
   */


  aeris.provide('aeris.maps.layers.KML');


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


    /**
     * Milliseconds between an autoupdate of the KML data.
     *
     * @type {number}
     */
    this.autoUpdateInterval = 0;

  };
  aeris.inherits(aeris.maps.layers.KML, aeris.maps.Layer);


  return aeris.maps.layers.KML;

});
