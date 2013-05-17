define(['aeris', 'base/extension/mapextension'], function(aeris) {

  /**
   * @fileoverview Interface definition for managing map events.
   */


  aeris.provide('aeris.maps.EventManager');


  /**
   * Creates an event manager that binds to an aeris map which helps manage
   * events for the map.
   *
   * @constructor
   * @extends {aeris.maps.extension.MapExtension}
   */
  aeris.maps.EventManager = function(aerisMap, options) {
    aeris.maps.extension.MapExtension.call(this, aerisMap, options);
  };
  aeris.inherits(aeris.maps.EventManager, aeris.maps.extension.MapExtension);


  return aeris.maps.EventManager;

});
