define(['aeris', './aerisinteractivetile'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Heat Index layer.
   */

  aeris.provide('aeris.maps.layers.AerisHeatIndex');


  /**
   * @constructor
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  aeris.maps.layers.AerisHeatIndex = function() {

    // Call parent constructor
    aeris.maps.layers.AerisInteractiveTile.call(this);

    /**
     * @override
     */
    this.name = 'AerisHeatIndex';

    /**
     * @override
     */
    this.tileType = 'current_heat_index';


    /**
     * @override
     */
    this.autoUpdateInterval = this.updateIntervals.CURRENT;
  };

  // Inherit from AerisInteractiveTile
  aeris.inherits(aeris.maps.layers.AerisHeatIndex,
                 aeris.maps.layers.AerisInteractiveTile
  );


  return aeris.maps.layers.AerisHeatIndex;
});