define([
  'aeris/util', './click', 'base/eventstrategies/mixins/aerissunmoondetailsclick'
], function(_) {

  /**
   * @fileoverview Aeris Weather Details click strategy for OpenLayers.
   */


  _.provide(
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
  _.inherits(aeris.maps.openlayers.eventstrategies.AerisSunMoonDetailsClick,
                 aeris.maps.openlayers.eventstrategies.Click);
  _.extend(
    aeris.maps.openlayers.eventstrategies.AerisSunMoonDetailsClick.prototype,
    aeris.maps.eventstrategies.mixins.AerisSunMoonDetailsClick);


  return aeris.maps.openlayers.eventstrategies.AerisSunMoonDetailsClick;

});
