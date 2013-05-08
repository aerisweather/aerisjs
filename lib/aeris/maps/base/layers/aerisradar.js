define(['aeris', './aerisinteractivetile'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Radar layer.
   */


  aeris.provide('aeris.maps.layers.AerisRadar');


  /**
   * @constructor
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  aeris.maps.layers.AerisRadar = function() {


    aeris.maps.layers.AerisInteractiveTile.call(this);


    /**
     * @override
     */
    this.name = 'AerisRadar';


    /**
     * @override
     */
    this.tileType = 'radar';


    /**
     * @override
     */
    this.subdomains = ['1', '2', '3', '4'];


    /**
     * @override
     */
    this.url = 'http://tile{d}.aerisapi.com/' +
               aeris.config.apiId + '_' +
               aeris.config.apiSecret +
               '/radar/{z}/{x}/{y}/{t}.png';


    /**
     * @override
     */
    this.minZoom = 0;


    /**
     * @override
     */
    this.maxZoom = 27;

  };
  aeris.inherits(aeris.maps.layers.AerisRadar,
                 aeris.maps.layers.AerisInteractiveTile);


  return aeris.maps.layers.AerisRadar;

});
