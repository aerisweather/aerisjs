define(['aeris', 'base/layerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer strategy for displaying an InfoBox within OL.
   */


  aeris.provide('aeris.maps.openlayers.layerstrategies.InfoBox');


  /**
   * A layer strategy for displaying an info window within Open Layers.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   */
  aeris.maps.openlayers.layerstrategies.InfoBox = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.InfoBox,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.InfoBox.prototype.createInstanceLayer =
      function(layer) {
    var popup = new OpenLayers.Popup.FramedCloud(layer.name,
      layer.getMap().toLatLon(layer.latLon),
      new OpenLayers.Size(100, 100),
      layer.content);
    return popup;
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.InfoBox.prototype.setInstanceLayer =
      function(instanceLayer, map) {
    map.addPopup(instanceLayer);
  };


  return aeris.maps.openlayers.layerstrategies.InfoBox;

});
