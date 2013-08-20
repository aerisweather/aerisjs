define(['aeris/util', './tile'], function(_) {

  /**
   * @fileoverview Representation of OpenStreetMaps layer.
   */


  _.provide('aeris.maps.layers.OSM');


  /**
   * Representation of OpenStreetMaps layer.
   *
   * @constructor
   * @extends {aeris.maps.layers.Tile}
   */
  aeris.maps.layers.OSM = function() {


    aeris.maps.layers.Tile.call(this);


    this.strategy.push('OSM');


    /**
     * @override
     */
    this.name = 'OpenStreetMap';


    /**
     * @override
     */
    this.subdomains = ['a', 'b', 'c'];

    /**
     * @override
     */
    this.server = 'http://{d}.tile.openstreetmap.org/';


    /**
     * @override
     */
    this.minZoom = 0;


    /**
     * @override
     */
    this.maxZoom = 18;

  };
  _.inherits(aeris.maps.layers.OSM, aeris.maps.layers.Tile);


  /**
   * @override
   */
  aeris.maps.layers.OSM.prototype.getUrl = function() {
    return this.server + '{z}/{x}/{y}.png';
  };


  return aeris.maps.layers.OSM;

});

