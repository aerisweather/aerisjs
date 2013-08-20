define(['aeris/util', 'base/layerstrategy'], function(_) {

  /**
   * @fileoverview Layer strategy for displaying an InfoBox within OL.
   */


  _.provide('aeris.maps.openlayers.layerstrategies.InfoBox');


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
  _.inherits(aeris.maps.openlayers.layerstrategies.InfoBox,
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
    var icon = new OpenLayers.Icon(_.config.path +
        'assets/marker_yellow.png', size, offset);
    markers.addMarker(new OpenLayers.Marker(latLon, icon));
    var popup = new OpenLayers.Popup.FramedCloud(layer.name,
      latLon, null, layer.content, null, true, this.popupClose_());
    popup.imageSrc = _.config.path + 'assets/wx-details-infobox-ol.png';
    return {
      popup: popup,
      markers: markers,
      styleize: this.styleize_(layer)
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
    instanceLayer.styleize(instanceLayer.popup);
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


  /**
   * Return a function that will be called when the InfoBox is displayed on
   * the map.
   *
   * @param {aeris.maps.Layer} layer The layer that will be styled.
   * @return {Function}
   * @private
   */
  aeris.maps.openlayers.layerstrategies.InfoBox.prototype.styleize_ =
      function(layer) {
    var self = this;
    function fn(popup) {
      self.setHeaderHeight_(popup, layer.style.headerHeight);
      self.setHeaderBackgroundColor_(popup,
                                     layer.style.headerBackgroundColor);
      self.setClosePosition_(popup, layer.style.closePosition);
    }
    return fn;
  };


  /**
   * Set the header height of the InfoBox.
   *
   * @param {OpenLayers.Popup.FramedCloud} popup The popup displayed on the map.
   * @param {string} height The height to set the InfoBox's header.
   * @private
   */
  aeris.maps.openlayers.layerstrategies.InfoBox.prototype.setHeaderHeight_ =
      function(popup, height) {
    var container = popup.groupDiv;
    var div = document.createElement('div');
    var height = (popup.relativePosition.match(/b[l|r]/)) ?
        (parseInt(height) - 20) + 'px' :
        (parseInt(height) - 19) + 'px';
    div.style['width'] = '100%';
    div.style['height'] = height;
    div.style['position'] = 'absolute';
    div.style['top'] = '21px';
    div.style['left'] = '1px';
    container.childNodes[2].appendChild(div);
    var div2 = document.createElement('div');
    div2.style['width'] = '100%';
    div2.style['height'] = height;
    div2.style['position'] = 'absolute';
    div2.style['top'] = '21px';
    div2.style['right'] = '1px';
    container.childNodes[3].appendChild(div2);
  };


  /**
   * Set the InfoBox's header background color.
   *
   * @param {OpenLayers.Popup.FramedCloud} popup The popup displayed on the map.
   * @param {string} color The color to set the InfoBox's header bg color.
   * @private
   */
  aeris.maps.openlayers.layerstrategies.InfoBox.prototype.
      setHeaderBackgroundColor_ = function(popup, color) {
    var container = popup.groupDiv;
    container.childNodes[2].childNodes[1].style['background-color'] = color;
    container.childNodes[3].childNodes[1].style['background-color'] = color;
  };


  /**
   * Set the InfoBox's close position.
   *
   * @param {OpenLayers.Popup.FramedCloud} popup The popup displayed on the map.
   * @param {string} position The position to set the InfoBox's close button.
   * @private
   */
  aeris.maps.openlayers.layerstrategies.InfoBox.prototype.
      setClosePosition_ = function(popup, position) {
    var container = popup.groupDiv;
    var top = (popup.relativePosition.match(/b[l|r]/)) ?
        (parseInt(position) + 32) + 'px' :
        position;
    container.childNodes[1].style['top'] = top;
  };


  return aeris.maps.openlayers.layerstrategies.InfoBox;

});
