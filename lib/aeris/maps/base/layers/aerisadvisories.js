define(['aeris', './aerisinteractivetile'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Advisories layer.
   */

  aeris.provide('aeris.maps.layers.AerisAdvisories');


  /**
   * @constructor
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  aeris.maps.layers.AerisAdvisories = function() {

    // Call parent constructor
    aeris.maps.layers.AerisInteractiveTile.call(this);

    /**
     * @override
     */
    this.name = 'AerisAdvisories';

    /**
     * @override
     */
    this.tileType = 'alerts';


    /**
     * @override
     */
    this.autoUpdateInterval = this.updateIntervals.ADVISORIES;
  };

  // Inherit from AerisInteractiveTile
  aeris.inherits(aeris.maps.layers.AerisAdvisories,
                 aeris.maps.layers.AerisInteractiveTile
  );


  return aeris.maps.layers.AerisAdvisories;
});