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
        url: aeris.config.path + 'assets/wx-details-marker.png',
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
   * @return {Function}
   * @private
   */
  aeris.maps.gmaps.layerstrategies.InfoBox.prototype.onClose_ =
      function(marker) {
    function fn() {
      google.maps.event.clearInstanceListeners(this);
      marker.setMap(null);
    };
    return fn;
  };


  return aeris.maps.gmaps.layerstrategies.InfoBox;

});
