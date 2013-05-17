define(['aeris', 'base/eventmanager'], function(aeris) {


  /**
   * @fileoverview OpenLayers Event Manager.
   */


  aeris.provide('aeris.maps.openlayers.EventManager');


  /**
   * An event manager for managing map events for an OL map instance.
   *
   * @constructor
   * @extends {aeris.maps.EventManager}
   */
  aeris.maps.openlayers.EventManager = function(aerisMap, options) {
    aeris.maps.EventManager.call(this, aerisMap, options);
  };
  aeris.inherits(aeris.maps.openlayers.EventManager, aeris.maps.EventManager);


  return aeris.maps.openlayers.EventManager;

});
