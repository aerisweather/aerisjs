define(['aeris/util', 'base/layers/aerisinteractivetile'], function(_) {

  /**
   * @fileoverview Representation of Aeris Heat Index layer.
   */

  _.provide('aeris.maps.layers.AerisHeatIndex');


  /**
   * @constructor
   * @class aeris.maps.layers.AerisHeatIndex
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
  _.inherits(aeris.maps.layers.AerisHeatIndex,
                 aeris.maps.layers.AerisInteractiveTile
  );


  return aeris.maps.layers.AerisHeatIndex;
});