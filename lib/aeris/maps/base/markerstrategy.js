define(['aeris/util', 'base/extension/mapextensionstrategy'], function(_) {

  /**
   * @fileoverview Interface definition for defining a marker strategy.
   */


  _.provide('aeris.maps.MarkerStrategy');


  /**
   * Create a marker strategy used by a marker manager to delegate marker
   * support.
   *
   * @constructor
   * @extends {aeris.maps.extension.MapExtensionStrategy}
   */
  aeris.maps.MarkerStrategy = function() {};
  _.inherits(aeris.maps.MarkerStrategy,
                 aeris.maps.extension.MapExtensionStrategy);


  /**
   * Place a given marker to a map.
   *
   * @param {aeris.maps.Marker} marker The marker to place on the map.
   * @param {Object} map The map instance to place the marker on.
   * @return {Object} marker The map library's marker instance placed on the map.
   */
  aeris.maps.MarkerStrategy.prototype.setMarker = _.abstractMethod;


  aeris.maps.MarkerStrategy.prototype.removeMarker = _.abstractMethod;


  aeris.maps.MarkerStrategy.prototype.setMarkerPosition = _.abstractMethod;


  return aeris.maps.MarkerStrategy;

});
