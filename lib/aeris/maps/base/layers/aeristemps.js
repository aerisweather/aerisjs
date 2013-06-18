define(['aeris', './aerisinteractivetile'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Temperatures layer.
   */

  aeris.provide('aeris.maps.layers.AerisTemps');


  /**
   * @constructor
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  aeris.maps.layers.AerisTemps = function() {

    // Call parent constructor
    aeris.maps.layers.AerisInteractiveTile.call(this);

    /**
     * @override
     */
    this.name = 'AerisTemps';

    /**
     * @override
     */
    this.tileType = 'current_temps';


    /**
     * @override
     */
    this.autoUpdateInterval = this.updateIntervals.CURRENT;

  };

  // Inherit from AerisInteractiveTile
  aeris.inherits(aeris.maps.layers.AerisTemps,
                 aeris.maps.layers.AerisInteractiveTile
  );


  /**
   * Note: current_temps jsonp endpoint
   * is using a non-standard callback name.
   *
   * @override
   */
  aeris.maps.layers.AerisTemps.prototype.getTileTimesCallback = function() {
    return "current_2mt_toiTimes";
  }


  return aeris.maps.layers.AerisTemps;
});