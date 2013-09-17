define(['aeris/util', 'base/markermanager', 'gmaps/markerstrategies/icon'],
function(_) {

  /**
   * @fileoverview Google Maps Marker Manager
   */


  _.provide('aeris.maps.gmaps.MarkerManager');


  /**
   * A MarkerManager for managing Markers for a Google Maps map instance.
   *
   * @constructor
   * @extends {aeris.maps.MarkerManager}
   */
  aeris.maps.gmaps.MarkerManager = function(aerisMap, opt_options) {
    aeris.maps.MarkerManager.call(this, aerisMap, opt_options);
  };
  _.inherits(aeris.maps.gmaps.MarkerManager, aeris.maps.MarkerManager);


  /**
   * @override
   */
  aeris.maps.gmaps.MarkerManager.prototype.strategies = {
    'Icon': aeris.maps.gmaps.markerstrategies.Icon
  };


  return aeris.maps.gmaps.MarkerManager;

});
