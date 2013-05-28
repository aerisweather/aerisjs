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


    /**
     * The markers layer.
     * 
     * @type {OpenLayers.Layer.Markers}
     * @private
     */
    this.markersLayer_ = new OpenLayers.Layer.Markers("InfoBoxMarkers");

  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.InfoBox,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.InfoBox.prototype.createInstanceLayer =
      function(layer) {
    var markers = this.markersLayer_;
    var size = new OpenLayers.Size(20,20);
    var latLon = layer.getMap().toLatLon(layer.latLon);
    var offset = new OpenLayers.Pixel(-(size.w/2), -(size.h/2));
    var icon = new OpenLayers.Icon('../wx-details-marker.png', size, offset);
    markers.addMarker(new OpenLayers.Marker(latLon, icon));
    var popup = new OpenLayers.Popup.FramedCloud(layer.name,
      latLon, null, layer.content, null, true, this.popupClose_());
    return {
      popup: popup,
      markers: markers
    };
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.InfoBox.prototype.setInstanceLayer =
      function(instanceLayer, map) {
    if (map.popups.length > 0)
      map.removePopup(map.popups[0]);
    if (instanceLayer.markers.markers.length > 1)
      instanceLayer.markers.removeMarker(instanceLayer.markers.markers[0]);
    map.addLayer(instanceLayer.markers);
    map.addPopup(instanceLayer.popup);
  };


  /**
   * Return a function that closes the popup.
   *
   * @return {Function}
   * @private
   */
  aeris.maps.openlayers.layerstrategies.InfoBox.prototype.popupClose_ =
      function() {
    var markers = this.markersLayer_;
    function fn(event) {
      this.map.removePopup(this);
      markers.removeMarker(markers.markers[0]);
    }
    return fn;
  };


  return aeris.maps.openlayers.layerstrategies.InfoBox;

});
