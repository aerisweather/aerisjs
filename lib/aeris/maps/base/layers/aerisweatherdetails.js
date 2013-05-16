define(['aeris', 'base/layer'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Weather Details layer.
   */


  aeris.provide('aeris.maps.layers.AerisWeatherDetails');


  /**
   * Representation of Aeris Weather Details layer.
   *
   * @constructor
   * @extends {aeris.maps.Layer}
   */
  aeris.maps.layers.AerisWeatherDetails = function() {
    aeris.maps.Layer.call(this);
    this.strategy.push('AerisWeatherDetails');
  };
  aeris.inherits(aeris.maps.layers.AerisWeatherDetails, aeris.maps.Layer);


  return aeris.maps.layers.AerisWeatherDetails;

});
