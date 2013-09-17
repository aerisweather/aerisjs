define(['aeris/util', 'base/layers/aerisinteractivetile'], function(_) {

  /**
   * @fileoverview Representation of Aeris Humidity layer.
   */

  _.provide('aeris.maps.layers.AerisHumidity');


  /**
   * @constructor
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  aeris.maps.layers.AerisHumidity = function() {

    // Call parent constructor
    aeris.maps.layers.AerisInteractiveTile.call(this);

    /**
     * @override
     */
    this.name = 'AerisHumidity';

    /**
     * @override
     */
    this.tileType = 'current_rh';


    /**
     * @override
     */
    this.updateIntervals = this.updateIntervals.CURRENT;
  };

  // Inherit from AerisInteractiveTile
  _.inherits(aeris.maps.layers.AerisHumidity,
                 aeris.maps.layers.AerisInteractiveTile
  );


  return aeris.maps.layers.AerisHumidity;
});