define(['aeris', 'base/layer'], function(aeris) {

  /**
   * @fileoverview Representation of a collection of polygons.
   */


  aeris.provide('aeris.maps.layers.Polygons');


  /**
   * Create a layer representing a collection of polygons.
   *
   * @constructor
   * @extends {aeris.maps.Layer}
   */
  aeris.maps.layers.Polygons = function() {
    aeris.maps.Layer.call(this);
    this.strategy.push('Polygons');
  };
  aeris.inherits(aeris.maps.layers.Polygons, aeris.maps.Layer);


  return aeris.maps.layers.Polygons;

});
