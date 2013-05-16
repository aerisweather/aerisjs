define(['aeris', 'base/layerstrategy'], function(aeris) {

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
    control.handler = new OpenLayers.Handler.Click(control, {
      'click': this.onClick_
    }, {
      'single': true,
      'double': false,
      'pixelTolerance': 0,
      'stopSingle': false,
      'stopDouble': false
    });
    return control;
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisWeatherDetails.prototype.
      registerInstanceLayer = function(instanceLayer, map) {
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
   * Handle the click event.
   *
   * @param {Object} event The click event.
   * @private
   */
  aeris.maps.openlayers.layerstrategies.AerisWeatherDetails.prototype.
      onClick_ = function(event) {
  };


  return aeris.maps.openlayers.layerstrategies.AerisWeatherDetails;

});
