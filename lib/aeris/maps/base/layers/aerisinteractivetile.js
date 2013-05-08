define(['aeris', './tile'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Interactive Tile layer.
   */


  aeris.provide('aeris.maps.layers.AerisInteractiveTile');


  /**
   * Representation of Aeris Interactive Tile layer.
   *
   * @constructor
   * @extends {aeris.maps.layers.Tile}
   */
  aeris.maps.layers.AerisInteractiveTile = function() {


    aeris.maps.layers.Tile.call(this);


    /**
     * Tile's timestamp in YYYYMMDDHHMMSS.
     *
     * @type {string}
     */
    this.time = null;


    /**
     * Interactive tile type.
     *
     * @type {string}
     */
    this.tileType = null;;


    this.strategy.push('AerisInteractiveTile');

  }
  aeris.inherits(aeris.maps.layers.AerisInteractiveTile,
                 aeris.maps.layers.Tile);


  return aeris.maps.layers.AerisInteractiveTile;

});
