define(['aeris/util', './aerisinteractivetile'], function(_) {

  /**
   * @fileoverview Representation of Aeris Radar layer.
   */


  _.provide('aeris.maps.layers.AerisRadar');


  /**
   * Representation of Aeris Radar layer.
   *
   * @constructor
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  aeris.maps.layers.AerisRadar = function() {
    aeris.maps.layers.AerisInteractiveTile.call(this);


    /**
     * @override
     */
    this.name = 'AerisRadar';


    /**
     * @override
     */
    this.tileType = 'radar';


    /**
     * @override
     */
    this.zIndex = 2;


    /**
     * @override
     */
    this.autoUpdateInterval = 1000 * 60 * 6;


    /**
     * @override
     */
    this.autoUpdateInterval = this.updateIntervals.RADAR;
  };
  _.inherits(aeris.maps.layers.AerisRadar,
                 aeris.maps.layers.AerisInteractiveTile);




  return aeris.maps.layers.AerisRadar;

});
