define(['aeris', 'base/markermanager', './markerstrategies/icon'],
function(aeris) {

  /**
   * @fileoverview Google Maps Marker Manager
   */


  aeris.provide('aeris.maps.gmaps.MarkerManager');


  /**
   * A MarkerManager for managing Markers for a Google Maps map instance.
   *
   * @constructor
   * @extends {aeris.maps.MarkerManager}
   */
  aeris.maps.gmaps.MarkerManager = function(aerisMap, opt_options) {
    aeris.maps.MarkerManager.call(this, aerisMap, opt_options);
  };
  aeris.inherits(aeris.maps.gmaps.MarkerManager, aeris.maps.MarkerManager);


  /**
   * @override
   */
  aeris.maps.gmaps.MarkerManager.prototype.strategies = {
    'Icon': aeris.maps.gmaps.markerstrategies.Icon
  };


  return aeris.maps.gmaps.MarkerManager;

});
