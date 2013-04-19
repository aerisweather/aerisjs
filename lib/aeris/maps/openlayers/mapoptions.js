define(['aeris', 'base/mapoptions'], function(aeris) {

  /**
   * @fileoverview Aeris Maps' wrapper of OpenLayers' maps options.
   */


  aeris.provide('aeris.maps.openlayers.MapOptions');


  /**
   * Wrap OpenLayers' maps options.
   *
   * @constructor
   * @extends {aeris.maps.MapOptions}
   */
  aeris.maps.openlayers.MapOptions = function(aerisMap, options) {
    aeris.maps.MapOptions.call(this, aerisMap, options);
  };
  aeris.inherits(aeris.maps.openlayers.MapOptions, aeris.maps.MapOptions);


  /**
   * @override
   */
  aeris.maps.openlayers.MapOptions.prototype.setCenter = function(center) {
    this.map.setCenter(center);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.MapOptions.prototype.setZoom = function(zoom) {
    this.map.zoomTo(zoom);
  };


  return aeris.maps.openlayers.MapOptions;

});
