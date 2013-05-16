define(['aeris', 'base/layerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting Aeris WX Details with
   *               Google Maps.
   */


  aeris.provide('aeris.maps.gmaps.layerstrategies.AerisWeatherDetails');


  /**
   * A strategy for supporting Aeris WX Details with Google Maps.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   */
  aeris.maps.gmaps.layerstrategies.AerisWeatherDetails = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  aeris.inherits(aeris.maps.gmaps.layerstrategies.AerisWeatherDetails,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisWeatherDetails.prototype.
      createInstanceLayer = function(layer, opt_options) {
    return true;
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisWeatherDetails.prototype.
      setInstanceLayer = function(instanceLayer, map) {
    google.maps.event.addListener(map, 'click', this.onClick_);
  };


  /**
   * Handle the click event
   *
   * @param {Object} event The click event
   * @private
   */
  aeris.maps.gmaps.layerstrategies.AerisWeatherDetails.prototype.
      onClick_ = function(event) {
    var latLon = [event.latLng.lat(), event.latLng.lng()];
      var weatherPromise = aeris.AerisAPI.getInstance().getWeather(latLon, {
        'limit': 3
      });
      weatherPromise.done(function(weather) {
      });
  };


  return aeris.maps.gmaps.layerstrategies.AerisWeatherDetails;

});
