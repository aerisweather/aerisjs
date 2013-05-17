define(['aeris', 'base/eventmanager', './eventstrategies/click'],
function(aeris) {


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


  /**
   * @override
   */
  aeris.maps.openlayers.EventManager.prototype.strategies = {
    'Click': aeris.maps.openlayers.eventstrategies.Click
  };


  return aeris.maps.openlayers.EventManager;

});
