define(['aeris', './polygons'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Convective Hazards layer.
   */


  aeris.provide('aeris.maps.layers.AerisConvectiveHazards');


  /**
   * Representation of Aeris Convective Hazards layer.
   *
   * @constructor
   * @extends {aeris.maps.layers.Polygons}
   */
  aeris.maps.layers.AerisConvectiveHazards = function() {
    aeris.maps.layers.Polygons.call(this);
  };
  aeris.inherits(aeris.maps.layers.AerisConvectiveHazards,
                 aeris.maps.layers.Polygons);


  return aeris.maps.layers.AerisConvectiveHazards;

});
