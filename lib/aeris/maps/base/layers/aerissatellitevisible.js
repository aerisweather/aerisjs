define(['aeris/util', 'base/layers/aerisinteractivetile'], function(_) {

  /**
   * @fileoverview Representation of Aeris Visible Satellite layer.
   */

  _.provide('aeris.maps.layers.AerisSatelliteVisible');


  /**
   * @constructor
   * @class aeris.maps.layers.AerisSatelliteVisible
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  aeris.maps.layers.AerisSatelliteVisible = function() {

    // Call parent constructor
    aeris.maps.layers.AerisInteractiveTile.call(this);

    /**
     * @override
     */
    this.name = 'AerisSatelliteVisible';

    /**
     * @override
     */
    this.tileType = 'sat_vistrans';


    /**
     * @override
     */
    this.autoUpdateInterval = this.updateIntervals.SATELLITE;
  };

  // Inherit from AerisInteractiveTile
  _.inherits(aeris.maps.layers.AerisSatelliteVisible,
                 aeris.maps.layers.AerisInteractiveTile
  );


  return aeris.maps.layers.AerisSatelliteVisible;
});