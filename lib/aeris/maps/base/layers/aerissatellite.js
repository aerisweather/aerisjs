define(['aeris/util', 'base/layers/aerisinteractivetile'], function(_) {

  /**
   * @fileoverview Representation of Aeris Infrared Satellite layer.
   */


  _.provide('aeris.maps.layers.AerisSatellite');


  /**
   * @constructor
   * @class aeris.maps.layers.AerisSatellite
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  aeris.maps.layers.AerisSatellite = function() {


    aeris.maps.layers.AerisInteractiveTile.call(this);


    /**
     * @override
     */
    this.name = 'AerisSatellite';


    /**
     * @override
     */
    this.tileType = 'sat';

    /**
     * @override
     */
    this.autoUpdateInterval = this.updateIntervals.SATELLITE;
  };
  _.inherits(aeris.maps.layers.AerisSatellite,
                 aeris.maps.layers.AerisInteractiveTile);



  return aeris.maps.layers.AerisSatellite;

});
