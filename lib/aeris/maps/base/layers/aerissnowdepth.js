define(['aeris', './aerisinteractivetile'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Snow Depth layer.
   */

  aeris.provide('aeris.maps.layers.AerisSnowDepth');


  /**
   * @constructor
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  aeris.maps.layers.AerisSnowDepth = function() {

    // Call parent constructor
    aeris.maps.layers.AerisInteractiveTile.call(this);

    /**
     * @override
     */
    this.name = 'AerisSnowDepth';

    /**
     * @override
     */
    this.tileType = 'snowdepth_snodas';
  };

  // Inherit from AerisInteractiveTile
  aeris.inherits(aeris.maps.layers.AerisSnowDepth,
                 aeris.maps.layers.AerisInteractiveTile
  );


  return aeris.maps.layers.AerisSnowDepth;
});