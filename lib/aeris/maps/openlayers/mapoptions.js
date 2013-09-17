define(['aeris/util', 'base/mapoptions'], function(_) {

  /**
   * @fileoverview Aeris Maps' wrapper of OpenLayers' maps options.
   */


  _.provide('aeris.maps.openlayers.MapOptions');


  /**
   * Wrap OpenLayers' maps options.
   *
   * @constructor
   * @class aeris.maps.openlayers.MapOptions
   * @extends {aeris.maps.MapOptions}
   */
  aeris.maps.openlayers.MapOptions = function(aerisMap, options) {
    aeris.maps.MapOptions.call(this, aerisMap, options);
  };
  _.inherits(aeris.maps.openlayers.MapOptions, aeris.maps.MapOptions);


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
