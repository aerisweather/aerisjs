define([
  'aeris/util', './click', 'base/eventstrategies/mixins/aerisweatherdetailsclick'
], function(_) {

  /**
   * @fileoverview Aeris Weather Details click strategy for OpenLayers.
   */


  _.provide(
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
  _.inherits(aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick,
                 aeris.maps.openlayers.eventstrategies.Click);
  _.extend(
    aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick.prototype,
    aeris.maps.eventstrategies.mixins.AerisWeatherDetailsClick);


  return aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick;

});
