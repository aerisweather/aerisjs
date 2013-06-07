define(['aeris', 'base/extension/mapextensionmanager'], function(aeris) {

  /**
   * @fileoverview Interface definition for managing map events.
   */


  aeris.provide('aeris.maps.EventManager');


  /**
   * Creates an event manager that binds to an aeris map which helps manage
   * events for the map.
   *
   * @constructor
   * @extends {aeris.maps.extension.MapExtensionManager}
   */
  aeris.maps.EventManager = function(aerisMap, options) {
    aeris.maps.extension.MapExtensionManager.call(this, aerisMap, options);
  };
  aeris.inherits(aeris.maps.EventManager,
                 aeris.maps.extension.MapExtensionManager);


  /**
   * Apply an event to the map.
   *
   * @param {aeris.maps.Event} event The event to apply.
   */
  aeris.maps.EventManager.prototype.setEvent = function(event) {
    var strategy = this.getStrategy(event);
    var instance = this.getInstance(event);
    instance.event = strategy.setEvent(event, this.map);
  };


  return aeris.maps.EventManager;

});
