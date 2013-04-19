define(['aeris', 'base/mapoptions'], function(aeris) {

  /**
   * @fileoverview Aeris Maps' wrapper of Google Maps' maps options.
   */


  aeris.provide('aeris.maps.gmaps.MapOptions');


  /**
   * Wrap Google Maps' maps options.
   *
   * @constructor
   * @extends {aeris.maps.MapOptions}
   */
  aeris.maps.gmaps.MapOptions = function(aerisMap, options) {
    aeris.maps.MapOptions.call(this, aerisMap, options);
  };
  aeris.inherits(aeris.maps.gmaps.MapOptions, aeris.maps.MapOptions);


  /**
   * @override
   */
  aeris.maps.gmaps.MapOptions.prototype.setCenter = function(center) {
    this.map.setCenter(center);
  };


  /**
   * @override
   */
  aeris.maps.gmaps.MapOptions.prototype.setZoom = function(zoom) {
    this.map.setZoom(zoom);
  };


  return aeris.maps.gmaps.MapOptions;

});
