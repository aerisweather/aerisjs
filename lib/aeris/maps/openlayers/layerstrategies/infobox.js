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
    var marker = new OpenLayers.Layer.Markers("Marker");
    var size = new OpenLayers.Size(20,20);
    var latLon = layer.getMap().toLatLon(layer.latLon);
    var offset = new OpenLayers.Pixel(-(size.w/2), -(size.h/2));
    var icon = new OpenLayers.Icon('../wx-details-marker.png', size, offset);
    marker.addMarker(new OpenLayers.Marker(latLon, icon));
    var popup = new OpenLayers.Popup.FramedCloud(layer.name,
      latLon,
      new OpenLayers.Size(100, 100),
      layer.content);
    return {
      popup: popup,
      marker: marker
    };
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.InfoBox.prototype.setInstanceLayer =
      function(instanceLayer, map) {
    map.addLayer(instanceLayer.marker);
    map.addPopup(instanceLayer.popup);
  };


  return aeris.maps.openlayers.layerstrategies.InfoBox;

});
