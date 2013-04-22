define(['aeris', 'base/layer'], function(aeris) {

  /**
   * @fileoverview Representation of OpenStreetMaps layer.
   */


  aeris.provide('aeris.maps.layers.OSM');


  /**
   * Representation of OpenStreetMaps layer.
   *
   * @constructor
   * @extends {aeris.maps.Layers}
   */
  aeris.maps.layers.OSM = function() {


    aeris.maps.Layer.call(this);


    this.strategy.push('OSM');

  };
  aeris.inherits(aeris.maps.layers.OSM, aeris.maps.Layer);


  return aeris.maps.layers.OSM;

});

