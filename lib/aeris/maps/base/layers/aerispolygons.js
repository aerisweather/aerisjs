define(['aeris/util', 'base/layers/polygons'], function(_) {

  /**
   * @fileoverview Representation of Aeris Polygons layer.
   */


  _.provide('aeris.maps.layers.AerisPolygons');


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
     * The Aeris polygon type.
     *
     * @type {string}
     */
    this.aerisPolygonType = null;


    /**
     * An object ob each group's styles.
     *
     * @type {Object}
     */
    this.styles = {};

  };
  _.inherits(aeris.maps.layers.AerisPolygons, aeris.maps.layers.Polygons);


  return aeris.maps.layers.AerisPolygons;

});
