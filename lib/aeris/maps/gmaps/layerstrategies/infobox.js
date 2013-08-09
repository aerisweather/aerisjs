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


    /**
     * A single instance of a InfoWindow in order to show only one.
     *
     * @type {google.maps.InfoWindow}
     * @private
     */
    this.popup_ = new google.maps.InfoWindow();
  };
  aeris.inherits(aeris.maps.gmaps.layerstrategies.InfoBox,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.InfoBox.prototype.createInstanceLayer =
      function(layer) {
    var latLon = layer.getMap().toLatLon(layer.latLon);
    var marker = new google.maps.Marker({
      position: latLon,
      icon: {
        url: aeris.config.path + 'assets/marker_yellow.png',
        anchor: new google.maps.Point(10,10)
      },
      clickable: false,
      flat: true
    });
    var popup = this.popup_;
    popup.setContent(layer.content);
    var onClose = this.onClose_(marker);
    google.maps.event.addListenerOnce(popup, 'closeclick', onClose);
    google.maps.event.addListenerOnce(popup, 'content_changed', onClose);
    google.maps.event.addListenerOnce(popup, 'domready', this.styleize_(layer));
    return {
      popup: popup,
      marker: marker
    }
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.InfoBox.prototype.setInstanceLayer =
      function(instanceLayer, map) {
    instanceLayer.marker.setMap(map);
    instanceLayer.popup.open(map, instanceLayer.marker);
  };


  /**
   * Return a function that is executed when the info box closes.
   *
   * @param {google.maps.Marker} marker A reference to the marker so it can
   *                                    also be closed.
   * @return {Function}
   * @private
   */
  aeris.maps.gmaps.layerstrategies.InfoBox.prototype.onClose_ =
      function(marker) {
    function fn() {
      google.maps.event.clearInstanceListeners(this);
      marker.setMap(null);
    }
    return fn;
  };


  /**
   * Return a function that will be called when the InfoBox's dom is ready and
   * will style the box. 
   *
   * @param {aeris.maps.Layer} layer The layer that will be styled.
   * @return {Function}
   * @private
   */
  aeris.maps.gmaps.layerstrategies.InfoBox.prototype.styleize_ =
      function(layer) {
    var self = this;
    function fn() {
      var container = this.Lb.L;
      self.setBorderRadius_(container, layer.style.borderRadius);
      self.setBorderColor_(container, layer.style.borderColor);
      self.setHeaderHeight_(container, layer.style.headerHeight);
      self.setBackgroundColor_(container, layer.style.backgroundColor);
      self.setHeaderBackgroundColor_(container,
                                     layer.style.headerBackgroundColor);
      self.setClosePosition_(container, layer.style.closePosition);
    }
    return fn;
  };


  /**
   * Set the radius of the InfoBox.
   *
   * @param {Node} container The InfoBox's container div.
   * @param {string} radius The radius to set the InfoBox's borders.
   * @private
   */
  aeris.maps.gmaps.layerstrategies.InfoBox.prototype.setBorderRadius_ =
      function(container, radius) {
    container = container.childNodes[1];
    container.childNodes[1].style['border-top-left-radius'] = radius;
    container.childNodes[1].style['border-top-right-radius'] = radius;
    container.childNodes[1].style['border-bottom-left-radius'] = radius;
    container.childNodes[1].style['border-bottom-right-radius'] = radius;
    container.childNodes[3].style['border-top-left-radius'] = radius;
    container.childNodes[3].style['border-top-right-radius'] = radius;
    container.childNodes[3].style['border-bottom-left-radius'] = radius;
    container.childNodes[3].style['border-bottom-right-radius'] = radius;
  };


  /**
   * Set the border color of the InfoBox.
   *
   * @param {Node} container The InfoBox's container div.
   * @param {string} color The color to set the InfoBox's borders.
   * @private
   */
  aeris.maps.gmaps.layerstrategies.InfoBox.prototype.setBorderColor_ =
      function(container, color) {
    container = container.childNodes[1];
    container.childNodes[1].style['background-color'] = color;
    container.childNodes[0].childNodes[0].childNodes[0].
        style['background-color'] = color;
    container.childNodes[0].childNodes[1].childNodes[0].
        style['background-color'] = color;
  };


  /**
   * Set the background color of the InfoBox.
   *
   * @param {Node} container The InfoBox's container div.
   * @param {string} color The color to set the background of the InfoBox.
   * @private
   */
  aeris.maps.gmaps.layerstrategies.InfoBox.prototype.setBackgroundColor_ =
      function(container, color) {
    container = container.childNodes[1];
    container.childNodes[3].childNodes[0].style['background-color'] =
        color;
    container.childNodes[2].style['border-top-color'] = color;
  };


  /**
   * Set the header height of the InfoBox.
   *
   * @param {Node} container The InfoBox's container div.
   * @param {string} height The height to set the header of the InfoBox.
   * @private
   */
  aeris.maps.gmaps.layerstrategies.InfoBox.prototype.setHeaderHeight_ =
      function(container, height) {
    content = container.childNodes[2];
    container = container.childNodes[1];
    var diff = parseInt(height) -
               parseInt(container.childNodes[3].style['top']);
    var div = document.createElement('div');
    div.style['width'] = '100%';
    div.style['height'] =
        (parseInt(container.childNodes[3].style['height']) - diff) + 'px';
    div.style['position'] = 'relative';
    div.style['top'] = diff + 'px';
    div.style['border-bottom-left-radius'] = 'inherit';
    div.style['border-bottom-right-radius'] = 'inherit';
    container.childNodes[3].appendChild(div);
  };


  /**
   * Set the background color of the InfoBox's header.
   *
   * @param {Node} container The InfoBox's container div.
   * @param {string} color The color to set the InfoBox's header.
   * @private
   */
  aeris.maps.gmaps.layerstrategies.InfoBox.prototype.
      setHeaderBackgroundColor_ = function(container, color) {
    container = container.childNodes[1];
    container.childNodes[3].style['background-color'] = color;
  };


  /**
   * Position the close box of the InfoBox.
   *
   * @param {Node} container The InfoBox's container div.
   * @param {Object} position The position to set the close box of the InfoBox.
   * @private
   */
  aeris.maps.gmaps.layerstrategies.InfoBox.prototype.
      setClosePosition_ = function(container, position) {
    position = parseInt(position);
    container.childNodes[0].style['margin-left'] = (3 - position) + 'px';
    container.childNodes[0].style['margin-top'] = (position - 3) + 'px';
  };


  return aeris.maps.gmaps.layerstrategies.InfoBox;

});
