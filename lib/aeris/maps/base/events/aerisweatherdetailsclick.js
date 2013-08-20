define(['aeris/util', './click'], function(_) {

  /**
   * @fileoverview A click that determines the lat/lon and gets the weather
   *               details from Aeris.
   */


  _.provide('aeris.maps.events.AerisWeatherDetailsClick');


  /**
   * A click event that gets the lat/lon and the weather for that point.
   *
   * @constructor
   * @extends {aeris.maps.events.Click}
   */
  aeris.maps.events.AerisWeatherDetailsClick = function() {
    aeris.maps.events.Click.call(this);
    this.strategy.push('AerisWeatherDetailsClick');


    /**
     * @override
     */
    this.name = 'AerisWeatherDetailsClick';

  };
  _.inherits(aeris.maps.events.AerisWeatherDetailsClick,
                 aeris.maps.events.Click);


  return aeris.maps.events.AerisWeatherDetailsClick;

});
