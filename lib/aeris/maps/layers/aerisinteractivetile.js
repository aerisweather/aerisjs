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
     * Tile's Metadata URL.
     *
     * @type {string}
     */
    this.metadataUrl = null;


    this.strategy.push('AerisInteractiveTile');

  }
  aeris.inherits(aeris.maps.layers.AerisInteractiveTile,
                 aeris.maps.layers.Tile);


  /**
   * @override
   */
  aeris.maps.layers.AerisInteractiveTile.prototype.getTileUrl =
      function(x, y, zoom) {
    var url = aeris.maps.layers.Tile.prototype.getTileUrl.
        call(this, x, y, zoom);
    url = url.replace(/\{t\}/, this.time);
    return url;
  };


  return aeris.maps.layers.AerisInteractiveTile;

});
