define(['aeris', 'base/extension/mapextensionstrategy'], function(aeris) {

  /**
   * @fileoverview Interface definition for defining a marker strategy.
   */


  aeris.provide('aeris.maps.MarkerStrategy');


  /**
   * Create a marker strategy used by a marker manager to delegate marker
   * support.
   *
   * @constructor
   * @extends {aeris.maps.extension.MapExtensionStrategy}
   */
  aeris.maps.MarkerStrategy = function() {};
  aeris.inherits(aeris.maps.MarkerStrategy,
                 aeris.maps.extension.MapExtensionStrategy);


  /**
   * Place a given marker to a map.
   *
   * @param {aeris.maps.Marker} marker The marker to place on the map.
   * @param {Object} map The map instance to place the marker on.
   */
  aeris.maps.MarkerStrategy.prototype.setMarker = aeris.abstractMethod;


  return aeris.maps.MarkerStrategy;

});
