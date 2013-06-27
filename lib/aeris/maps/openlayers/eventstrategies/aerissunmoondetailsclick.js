define([
  'aeris', './click', 'base/eventstrategies/mixins/aerissunmoondetailsclick'
], function(aeris) {

  /**
   * @fileoverview Aeris Weather Details click strategy for OpenLayers.
   */


  aeris.provide(
    'aeris.maps.openlayers.eventstrategies.AerisSunMoonDetailsClick');


  /**
   * A strategy for support of a Aeris Weather Details click strategy for
   * OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.openlayers.eventstrategies.Click}
   * @extends {aeris.maps.eventstrategies.mixins.AerisSunMoonDetailsClick}
   */
  aeris.maps.openlayers.eventstrategies.AerisSunMoonDetailsClick = function() {
    aeris.maps.openlayers.eventstrategies.Click.call(this);
  };
  aeris.inherits(aeris.maps.openlayers.eventstrategies.AerisSunMoonDetailsClick,
                 aeris.maps.openlayers.eventstrategies.Click);
  aeris.extend(
    aeris.maps.openlayers.eventstrategies.AerisSunMoonDetailsClick.prototype,
    aeris.maps.eventstrategies.mixins.AerisSunMoonDetailsClick);


  return aeris.maps.openlayers.eventstrategies.AerisSunMoonDetailsClick;

});
