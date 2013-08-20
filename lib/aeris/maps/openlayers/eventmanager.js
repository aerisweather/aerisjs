define([
  'aeris/util',
  'base/eventmanager',
  './eventstrategies/click',
  './eventstrategies/aerisweatherdetailsclick',
  './eventstrategies/aerissunmoondetailsclick'
],
function(_) {


  /**
   * @fileoverview OpenLayers Event Manager.
   */


  _.provide('aeris.maps.openlayers.EventManager');


  /**
   * An event manager for managing map events for an OL map instance.
   *
   * @constructor
   * @extends {aeris.maps.EventManager}
   */
  aeris.maps.openlayers.EventManager = function(aerisMap, options) {
    aeris.maps.EventManager.call(this, aerisMap, options);
  };
  _.inherits(aeris.maps.openlayers.EventManager, aeris.maps.EventManager);


  /**
   * @override
   */
  aeris.maps.openlayers.EventManager.prototype.strategies = {
    'Click': aeris.maps.openlayers.eventstrategies.Click,
    'AerisWeatherDetailsClick': aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick,
    'AerisSunMoonDetailsClick': aeris.maps.openlayers.eventstrategies.AerisSunMoonDetailsClick
  };


  return aeris.maps.openlayers.EventManager;

});
