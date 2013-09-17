define(['aeris/util', 'base/layers/aerisinteractivetile'], function(_) {

  /**
   * @fileoverview Representation of Aeris Wind Chill layer.
   */

  _.provide('aeris.maps.layers.AerisWindChill');


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
  _.inherits(aeris.maps.layers.AerisWindChill,
                 aeris.maps.layers.AerisInteractiveTile
  );


  return aeris.maps.layers.AerisWindChill;
});