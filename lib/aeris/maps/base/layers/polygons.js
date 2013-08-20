define(['aeris/util', 'base/layer'], function(_) {

  /**
   * @fileoverview Representation of a collection of polygons.
   */


  _.provide('aeris.maps.layers.Polygons');


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
  _.inherits(aeris.maps.layers.Polygons, aeris.maps.Layer);


  return aeris.maps.layers.Polygons;

});
