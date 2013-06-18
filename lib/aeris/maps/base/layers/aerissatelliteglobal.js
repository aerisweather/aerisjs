define(['aeris', './aerisinteractivetile'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Global Satellite layer.
   */

  aeris.provide('aeris.maps.layers.AerisSatelliteGlobal');


  /**
   * @constructor
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  aeris.maps.layers.AerisSatelliteGlobal = function() {

    // Call parent constructor
    aeris.maps.layers.AerisInteractiveTile.call(this);

    /**
     * @override
     */
    this.name = 'AerisSatelliteGlobal';

    /**
     * @override
     */
    this.tileType = 'globalsat';


    /**
     * @override
     */
    this.autoUpdateInterval = this.updateIntervals.SATELLITE;

  };

  // Inherit from AerisInteractiveTile
  aeris.inherits(aeris.maps.layers.AerisSatelliteGlobal,
                 aeris.maps.layers.AerisInteractiveTile
  );


  return aeris.maps.layers.AerisSatelliteGlobal;
});