define(['aeris', 'base/extension/mapextensionstrategy'], function(aeris) {

  /**
   * @fileoverview Interface definition for defining an event strategy.
   */


  aeris.provide('aeris.maps.EventStrategy');


  /**
   * An event strategy is used by an event manager to delegate event support.
   *
   * @constructor
   * @extends {aeris.maps.extension.MapExtensionStrategy}
   */
  aeris.maps.EventStrategy = function() {};
  aeris.inherits(aeris.maps.EventStrategy,
                 aeris.maps.extension.MapExtensionStrategy);


  /**
   * Attach a given event to a map.
   *
   * @param {aeris.maps.Event} event The event to attach to the map.
   * @param {Object} map The map instance to attach event.
   */
  aeris.maps.EventStrategy.prototype.setEvent = aeris.abstractMethod;


  return aeris.maps.EventStrategy;

});
