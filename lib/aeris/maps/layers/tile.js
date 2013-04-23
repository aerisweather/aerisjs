define(['aeris', 'base/layer'], function(aeris) {

  /**
   * @fileoverview Representation of image tile (xyz) layer.
   */


  aeris.provide('aeris.maps.layers.Tile');


  /**
   * Representation of image tile (xyz) layer.
   *
   * @constructor
   * @extends {aeris.maps.Layers}
   */
  aeris.maps.layers.Tile = function() {


    aeris.maps.Layer.call(this);


    this.strategy.push('Tile');


    /**
     * An array of subdomains to use for load balancing tile requests.
     *
     * @type {Array.<string>}
     */
    this.subdomains = [];


    /**
     * The url for requesting tiles. The url will be interpolated by replacing
     * special variables with calculated values. Special variables should be
     * wrapped with '{' and '}'.
     *
     * * {d} - a randomly selected subdomain
     * * {z} - the calculated zoom factor
     * * {x} - the tile's starting x coordinate
     * * {y} - the tile's starting y coordinate
     * 
     * ex. http://{d}.tileserver.net/{z}/{x}/{y}.png
     *
     * @type {string}
     */
    this.url = null;


    /**
     * The minimum zoom level provided by the tile renderer.
     *
     * @type {numbr}
     */
    this.minZoom = 0;


    /**
     * The maximum zoom level provided by the tile renderer.
     *
     * @type {number}
     */
    this.maxZoom = 22;

  };
  aeris.inherits(aeris.maps.layers.Tile, aeris.maps.Layer);


  /**
   * Implemented map specific zoom factor calculation.
   *
   * @param {number} zoom the map's current zoom level.
   * @return {number}
   */
  aeris.maps.layers.Tile.prototype.zoomFactor = function(zoom) {
    return zoom;
  };


  /**
   * Determine a tile's url based on coordinates and zoom.
   *
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} zoom The zoom level.
   * @return {string} Return the tile's url.
   */
  aeris.maps.layers.Tile.prototype.getTileUrl = function(x, y, zoom) {
    var zfactor = this.zoomFactor(zoom);

    var subdomain = this.subdomains[Math.floor(Math.random() * 
                                               this.subdomains.length)];

    var url = this.url;
    url = url.replace(/\{d\}/, subdomain);
    url = url.replace(/\{z\}/, zfactor);
    url = url.replace(/\{x\}/, x);
    url = url.replace(/\{y\}/, y);

    return url;
  };


  return aeris.maps.Layer;

});
