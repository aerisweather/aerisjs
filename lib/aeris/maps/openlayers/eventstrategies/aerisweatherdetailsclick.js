define(['aeris', './click', 'aeris/aerisapi'], function(aeris) {

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
   */
  aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick = function() {
    aeris.maps.openlayers.eventstrategies.Click.call(this);
  };
  aeris.inherits(aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick,
                 aeris.maps.openlayers.eventstrategies.Click);


  /**
   * @override
   */
  aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick.prototype.
      onClick = function(aerisEvent, map) {
    function fn(event) {
      var lonLat = map.getLonLatFromPixel(event.xy);
      var lonLatGeo = lonLat.clone();
      if (map.getProjection() != 'EPSG:4326')
        lonLatGeo.transform(map.getProjectionObject(),
                            new OpenLayers.Projection('EPSG:4326'));
      var latLon = [lonLatGeo.lat, lonLatGeo.lon];
      var weatherPromise = aeris.AerisAPI.getInstance().getWeather(latLon, {
        'limit': 3
      });
      weatherPromise.done(function(weather) {
        aerisEvent.trigger('click', latLon, weather);
      });
    }
    return fn
  };


  return aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick;

});
