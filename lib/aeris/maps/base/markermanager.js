define(['aeris', 'base/extension/mapextensionmanager'], function(aeris) {

  /**
   * @fileoverview Interface definition for managing map markers.
   */


  aeris.provide('aeris.maps.MarkerManager');


  /**
   * Creates a marker manager that binds to an aeris map which helps manage
   * markers for the map.
   *
   * @constructor
   * @extends {aeris.maps.extension.MapExtensionManager}
   */
  aeris.maps.MarkerManager = function(aerisMap, opt_options) {
    aeris.maps.extension.MapExtensionManager.call(this, aerisMap, opt_options);
  };
  aeris.inherits(aeris.maps.MarkerManager,
                 aeris.maps.extension.MapExtensionManager);


  /**
   * Apply an marker to the map.
   *
   * @param {aeris.maps.Marker} marker The marker to apply.
   */
  aeris.maps.MarkerManager.prototype.setMarker = function(marker) {
    var strategy = this.getStrategy(marker);
    var instance = this.getInstance(marker);
    instance.marker = strategy.setMarker(marker, this.map);
  };


  return aeris.maps.MarkerManager;

});
