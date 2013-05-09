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


  /**
   * @override
   */
  aeris.maps.layers.AerisInteractiveTile.prototype.clone = function(properties) {
    var cloned = new aeris.maps.layers.AerisRadar();
    for (var k in this) {
      if (typeof this[k] != 'function' && k != 'id') {
        cloned[k] = this[k];
      }
    }
    aeris.extend(cloned, properties);
    cloned.setMap(this.aerisMap_);
    return cloned;
  };


  return aeris.maps.layers.AerisRadar;

});
