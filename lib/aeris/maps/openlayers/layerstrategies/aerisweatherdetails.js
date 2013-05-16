define(['aeris', 'base/layerstrategy', 'aeris/aerisapi'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting Aeris WX Details with
   *               OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.layerstrategies.AerisWeatherDetails');


  /**
   * A strategy for supporting Aeris WX Details with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   */
  aeris.maps.openlayers.layerstrategies.AerisWeatherDetails = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.AerisWeatherDetails,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisWeatherDetails.prototype.
      createInstanceLayer = function(layer, opt_options) {
    var control = new OpenLayers.Control();
    return control;
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisWeatherDetails.prototype.
      registerInstanceLayer = function(instanceLayer, map) {
    instanceLayer.handler = new OpenLayers.Handler.Click(instanceLayer, {
      'click': this.onClick_(map)
    }, {
      'single': true,
      'double': false,
      'pixelTolerance': 0,
      'stopSingle': false,
      'stopDouble': false
    });
    map.addControl(instanceLayer);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisWeatherDetails.prototype.
      setInstanceLayer = function(instanceLayer, map) {
    instanceLayer.activate();
  };


  /**
   * Return a callback function that handles the click event.
   *
   * @param {Object} map The map the click occurs on.
   * @return {Function}
   * @private
   */
  aeris.maps.openlayers.layerstrategies.AerisWeatherDetails.prototype.
      onClick_ = function(map) {
    function fn(event) {
      var lonLat = map.getLonLatFromPixel(event.xy);
      if (map.getProjection() != 'EPSG:4326')
        lonLat.transform(map.getProjectionObject(),
                         new OpenLayers.Projection('EPSG:4326'));
      var latLon = [lonLat.lat, lonLat.lon];
      var weatherPromise = aeris.AerisAPI.getInstance().getWeather(latLon, {
        'limit': 3
      });
      weatherPromise.done(function(weather) {
      });
    }
    return fn;
  };


  return aeris.maps.openlayers.layerstrategies.AerisWeatherDetails;

});
