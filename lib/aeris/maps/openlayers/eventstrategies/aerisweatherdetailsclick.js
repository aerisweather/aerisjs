define([
  'aeris', './click', 'base/eventstrategies/mixins/aerisweatherdetailsclick'
], function(aeris) {

  /**
   * @fileoverview Aeris Weather Details click strategy for OpenLayers.
   */


  aeris.provide(
    'aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick');


  /**
   * A strategy for support of a Aeris Weather Details click strategy for
   * OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.openlayers.eventstrategies.Click}
   * @extends {aeris.maps.eventstrategies.mixins.AerisWeatherDetailsClick}
   */
  aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick = function() {
    aeris.maps.openlayers.eventstrategies.Click.call(this);
  };
  aeris.inherits(aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick,
                 aeris.maps.openlayers.eventstrategies.Click);
  aeris.extend(
    aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick.prototype,
    aeris.maps.eventstrategies.mixins.AerisWeatherDetailsClick);


  return aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick;

});
