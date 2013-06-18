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
    this.autoUpdateInterval = this.updateIntervals.SATELLITE;
  };
  aeris.inherits(aeris.maps.layers.AerisSatellite,
                 aeris.maps.layers.AerisInteractiveTile);



  return aeris.maps.layers.AerisSatellite;

});
