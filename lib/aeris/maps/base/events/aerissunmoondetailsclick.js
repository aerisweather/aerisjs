define(['aeris/util', './click'], function(_) {

  /**
   * @fileoverview A click that determines the lat/lon and gets the sun/moon
   *               details from Aeris.
   */


  _.provide('aeris.maps.events.AerisSunMoonDetailsClick');


  /**
   * A click event that gets the lat/lon and sun/moon data for that point.
   *
   * @constructor
   * @extends {aeris.maps.events.Click}
   */
  aeris.maps.events.AerisSunMoonDetailsClick = function() {
    aeris.maps.events.Click.call(this);
    this.strategy.push('AerisSunMoonDetailsClick');


    /**
     * @override
     */
    this.name = 'AerisSunMoonDetailsClick';

  };
  _.inherits(aeris.maps.events.AerisSunMoonDetailsClick,
                 aeris.maps.events.Click);


  return aeris.maps.events.AerisSunMoonDetailsClick;

});
