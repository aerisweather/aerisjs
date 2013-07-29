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


  /**
   * @override
   */
  aeris.maps.gmaps.MapOptions.prototype.registerBoundsListeners_ = function() {
    var self = this;
    google.maps.event.addListener(this.map, 'idle', function() {
      self.trigger('change:bounds', self.getBounds());
    });
  }


  /**
   * @override
   */
  aeris.maps.gmaps.MapOptions.prototype.getBounds = function() {
    var bounds = this.map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    return [[ne.lat(), ne.lng()], [sw.lat(), sw.lng()]];
  };


  return aeris.maps.gmaps.MapOptions;

});
