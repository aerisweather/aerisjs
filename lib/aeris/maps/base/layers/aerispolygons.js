define(['aeris', './polygons'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Polygons layer.
   */


  aeris.provide('aeris.maps.layers.AerisPolygons');


  /**
   * Representation of Aeris Polygons layer.
   *
   * @constructor
   * @extends {aeris.maps.layers.Polygons}
   */
  aeris.maps.layers.AerisPolygons = function() {
    aeris.maps.layers.Polygons.call(this);
    this.strategy.push('AerisPolygons');


    /**
     * The URL to fetch with the polygon information.
     *
     * @type {string}
     */
    this.url = null;


    /**
     * An object ob each group's styles.
     *
     * @type {Object}
     */
    this.styles = {};

  };
  aeris.inherits(aeris.maps.layers.AerisPolygons, aeris.maps.layers.Polygons);


  return aeris.maps.layers.AerisPolygons;

});
