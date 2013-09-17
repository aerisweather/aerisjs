define(['aeris/util', 'base/layers/aerisinteractivetile'], function(_) {

  /**
   * @fileoverview Representation of Aeris Dew Points layer.
   */

  _.provide('aeris.maps.layers.AerisDewPoints');


  /**
   * @constructor
   * @class aeris.maps.layers.AerisDewPoints
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  aeris.maps.layers.AerisDewPoints = function() {

    // Call parent constructor
    aeris.maps.layers.AerisInteractiveTile.call(this);

    /**
     * @override
     */
    this.name = 'AerisDewPoints';

    /**
     * @override
     */
    this.tileType = 'current_dp';


    /**
     * @override
     */
    this.autoUpdateInterval = this.updateIntervals.CURRENT;
  };

  // Inherit from AerisInteractiveTile
  _.inherits(aeris.maps.layers.AerisDewPoints,
                 aeris.maps.layers.AerisInteractiveTile
  );


  return aeris.maps.layers.AerisDewPoints;
});