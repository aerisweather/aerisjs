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


  /**
   * @override
   */
  aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick.prototype.
      getLatLonFromEvent = function(event, map) {
    var lonLat = map.getLonLatFromPixel(event.xy);
    var lonLatGeo = lonLat.clone();
    if (map.getProjection() != 'EPSG:4326')
      lonLatGeo.transform(map.getProjectionObject(),
                          new OpenLayers.Projection('EPSG:4326'));
    var latLon = [lonLatGeo.lat, lonLatGeo.lon];
    return latLon;
  };


  return aeris.maps.openlayers.eventstrategies.AerisWeatherDetailsClick;

});
