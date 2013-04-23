define(['aeris', './tile'], function(aeris) {

  /**
   * @fileoverview Representation of OpenStreetMaps layer.
   */


  aeris.provide('aeris.maps.layers.OSM');


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
    this.url = 'http://{d}.tile.openstreetmap.org/{z}/{x}/{y}.png';


    /**
     * @override
     */
    this.minZoom = 0;


    /**
     * @override
     */
    this.maxZoom = 18;

  };
  aeris.inherits(aeris.maps.layers.OSM, aeris.maps.layers.Tile);


  return aeris.maps.layers.OSM;

});

