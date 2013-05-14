define(['aeris', './aerisinteractivetile'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Infrared Satellite layer.
   */


  aeris.provide('aeris.maps.layers.AerisSatellite');


  /**
   * @constructor
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  aeris.maps.layers.AerisSatellite = function() {


    aeris.maps.layers.AerisInteractiveTile.call(this);


    /**
     * @override
     */
    this.name = 'AerisSatellite';


    /**
     * @override
     */
    this.tileType = 'sat';


    /**
     * @override
     */
    this.url = 'http://tile{d}.aerisapi.com/' +
               aeris.config.apiId + '_' +
               aeris.config.apiSecret +
               '/sat/{z}/{x}/{y}/{t}.png';

  };
  aeris.inherits(aeris.maps.layers.AerisSatellite,
                 aeris.maps.layers.AerisInteractiveTile);


  /**
   * @override
   */
  aeris.maps.layers.AerisSatellite.prototype.clone =
      function(properties) {
    var cloned = new aeris.maps.layers.AerisSatellite();
    for (var k in this) {
      if (typeof this[k] != 'function' && k != 'id') {
        cloned[k] = this[k];
      }
    }
    cloned.clear();
    aeris.extend(cloned, properties);
    cloned.setMap(this.aerisMap_);
    return cloned;
  };


  return aeris.maps.layers.AerisSatellite;

});
