define(['aeris', 'base/layerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer strategy for display an InfoBox within Google Maps.
   */


  aeris.provide('aeris.maps.gmaps.layerstrategies.InfoBox');


  /**
   * A layer strategy for displaying an info window withing Google Maps.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   */
  aeris.maps.gmaps.layerstrategies.InfoBox = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  aeris.inherits(aeris.maps.gmaps.layerstrategies.InfoBox,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.InfoBox.prototype.createInstanceLayer =
      function(layer) {
    var popup = new google.maps.InfoWindow({
      position: layer.getMap().toLatLon(layer.latLon),
      content: layer.content
    });
    return popup;
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.InfoBox.prototype.setInstanceLayer =
      function(instanceLayer, map) {
    instanceLayer.open(map);
  };


  return aeris.maps.gmaps.layerstrategies.InfoBox;

});
