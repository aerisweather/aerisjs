define(['aeris/util', 'base/layers/aerisinteractivetile'], function(_) {

  /**
   * @fileoverview Representation of Aeris Snow Depth layer.
   */

  _.provide('aeris.maps.layers.AerisSnowDepth');


  /**
   * @constructor
   * @class aeris.maps.layers.AerisSnowDepth
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
  _.inherits(aeris.maps.layers.AerisSnowDepth,
                 aeris.maps.layers.AerisInteractiveTile
  );


  return aeris.maps.layers.AerisSnowDepth;
});