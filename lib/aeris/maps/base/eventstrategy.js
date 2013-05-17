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


  return aeris.maps.EventStrategy;

});
