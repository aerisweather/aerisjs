define(['aeris/util', 'base/extension/mapextensionmanager'], function(_) {

  /**
   * @fileoverview Interface definition for managing map markers.
   */


  _.provide('aeris.maps.MarkerManager');


  /**
   * Creates a marker manager that binds to an aeris map which helps manage
   * markers for the map.
   *
   * @constructor
   * @class aeris.maps.MarkerManager
   * @extends {aeris.maps.extension.MapExtensionManager}
   */
  aeris.maps.MarkerManager = function(aerisMap, opt_options) {
    aeris.maps.extension.MapExtensionManager.call(this, aerisMap, opt_options);
  };
  _.inherits(aeris.maps.MarkerManager,
                 aeris.maps.extension.MapExtensionManager);


  aeris.maps.MarkerManager.prototype.clearInstance = function(obj) {
    this.instances_[obj.cid] = null;
  };

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


  aeris.maps.MarkerManager.prototype.setMarkerPosition = function(marker, latLon) {
    var strategy = this.getStrategy(marker);
    var instance = this.getInstance(marker);

    strategy.setMarkerPosition(instance.marker, latLon);
  };


  aeris.maps.MarkerManager.prototype.removeMarker = function(marker, opt_options) {
    var options = opt_options || {};
    var strategy = this.getStrategy(marker);
    var instance = this.getInstance(marker);

    strategy.removeMarker(instance.marker, this.map);
    this.clearInstance(marker);


    if (options.trigger !== false) {
      marker.trigger('remove');
    }
  };


  return aeris.maps.MarkerManager;

});
