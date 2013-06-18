define(['aeris', './aerisinteractivetile'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Wind Chill layer.
   */

  aeris.provide('aeris.maps.layers.AerisWindChill');


  /**
   * @constructor
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  aeris.maps.layers.AerisWindChill = function() {

    // Call parent constructor
    aeris.maps.layers.AerisInteractiveTile.call(this);

    /**
     * @override
     */
    this.name = 'AerisWindChill';

    /**
     * @override
     */
    this.tileType = 'current_windchill';


    /**
     * @override
     */
    this.autoUpdateInterval = this.updateIntervals.CURRENT;

  };

  // Inherit from AerisInteractiveTile
  aeris.inherits(aeris.maps.layers.AerisWindChill,
                 aeris.maps.layers.AerisInteractiveTile
  );


  return aeris.maps.layers.AerisWindChill;
});