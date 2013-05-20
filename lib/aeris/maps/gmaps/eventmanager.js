define([
  'aeris',
  'base/eventmanager',
  './eventstrategies/click',
  './eventstrategies/aerisweatherdetailsclick'
], function(aeris) {

  /**
   * @fileoverview Google Maps Event Manager
   */


  aeris.provide('aeris.maps.gmaps.EventManager');


  /**
   * An event manager for managing map events for a GMaps map instance.
   *
   * @constructor
   * @extends {aeris.maps.EventManager}
   */
  aeris.maps.gmaps.EventManager = function(aerisMap, options) {
    aeris.maps.EventManager.call(this, aerisMap, options);
  };
  aeris.inherits(aeris.maps.gmaps.EventManager, aeris.maps.EventManager);


  /**
   * @override
   */
  aeris.maps.gmaps.EventManager.prototype.strategies = {
    'Click': aeris.maps.gmaps.eventstrategies.Click,
    'AerisWeatherDetailsClick':
        aeris.maps.gmaps.eventstrategies.AerisWeatherDetailsClick
  };


  return aeris.maps.gmaps.EventManager;

});
