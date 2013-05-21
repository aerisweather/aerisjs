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
     * @override
     */
    this.subdomains = ['1', '2', '3', '4'];


    /**
     * @override
     */
    this.minZoom = 0;


    /**
     * @override
     */
    this.maxZoom = 27;


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
    this.tileType = null;


    /**
     * The tile time index to use for displaying the layer.
     *
     * @type {number}
     */
    this.timeIndex = 0;


    this.strategy.push('AerisInteractiveTile');

  }
  aeris.inherits(aeris.maps.layers.AerisInteractiveTile,
                 aeris.maps.layers.Tile);


  return aeris.maps.layers.AerisInteractiveTile;

});
