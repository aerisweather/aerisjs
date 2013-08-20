define(['aeris/util', 'aeris/aerisapi'], function(_) {

  /**
   * @fileoverview Shared implementation of AerisWeatherDetailsClick strategy.
   */


  _.provide('aeris.maps.eventstrategies.mixins.AerisWeatherDetailsClick');


  /**
   * A mixin for shared implementation of the AerisWeatherDetailsClick strategy.
   *
   * @const
   */
  aeris.maps.eventstrategies.mixins.AerisWeatherDetailsClick = {


    /**
     * @override
     */
    onClick: function(aerisEvent, map) {
      var self = this;
      function fn(event) {
        var latLon = self.getLatLonFromEvent(event, map);
        var weatherPromise = aeris.AerisAPI.getInstance().getWeather(latLon, {
          'limit': 3
        });
        weatherPromise.done(function(weather) {
          aerisEvent.trigger('click', latLon, weather);
        });
      };
      return fn;
    },

  };


  return aeris.maps.eventstrategies.mixins.AerisWeatherDetailsClick;

});
