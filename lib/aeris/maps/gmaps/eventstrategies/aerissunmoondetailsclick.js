define([
  'aeris',
  './click',
  'base/eventstrategies/mixins/aerissunmoondetailsclick'
], function(aeris) {

  /**
   * @fileoverview Aeris Sun Moon Details click strategy for Google Maps.
   */


  aeris.provide('aeris.maps.gmaps.eventstrategies.AerisSunMoonDetailsClick');


  /**
   * A strategy for support of an Aeris Sun Moon Details click for Google Maps.
   *
   * @constructor
   * @extends {aeris.maps.gmaps.eventstrategies.Click}
   * @extends {aeris.maps.eventstrategies.mixins.AerisSunMoonDetailsClick}
   */
  aeris.maps.gmaps.eventstrategies.AerisSunMoonDetailsClick = function() {
    aeris.maps.gmaps.eventstrategies.Click.call(this);
  };
  aeris.inherits(aeris.maps.gmaps.eventstrategies.AerisSunMoonDetailsClick,
                 aeris.maps.gmaps.eventstrategies.Click);
  aeris.extend(
    aeris.maps.gmaps.eventstrategies.AerisSunMoonDetailsClick.prototype,
    aeris.maps.eventstrategies.mixins.AerisSunMoonDetailsClick);




});
