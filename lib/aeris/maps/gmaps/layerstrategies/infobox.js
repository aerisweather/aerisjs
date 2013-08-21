define(['aeris/util', 'base/layerstrategy'], function(_) {

  /**
   * @fileoverview Layer strategy for display an InfoBox within Google Maps.
   */


  _.provide('aeris.maps.gmaps.layerstrategies.InfoBox');


  /**
   * A layer strategy for displaying an info window withing Google Maps.
   *
   * @constructor
   * @class
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


    /**
     * Maps the names of google events to aeris Marker events
     * @type {Object}
     * @private
     */
    this.eventMap_ = {
      'closeclick': 'close'
    };

    this.layerEvents = {
      'close': this.onClose_
    };
  };
  _.inherits(aeris.maps.gmaps.layerstrategies.InfoBox,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.InfoBox.prototype.createInstanceLayer =
      function(layer) {
    var latLon = layer.getMap().toLatLon(layer.latLon);

    this.layer_ = layer;

    this.marker_ = new google.maps.Marker({
      position: latLon,
      icon: {
        url: _.config.path + 'assets/marker_yellow.png',
        anchor: new google.maps.Point(10, 10)
      },
      visible: !layer.options.hideMarker,
      clickable: false,
      flat: true
    });

    this.popup_.setContent(layer.content);

    this.delegateEvents(layer, this.popup_);

    return {
      popup: this.popup_,
      marker: this.marker_
    };
  };

  /**
   * Bind events related to this infobox
   *
   * @param {aeris.maps.Marker} aerisInfoBox
   * @param {google.maps.Marker} gInfoBox
   */
  aeris.maps.gmaps.layerstrategies.
  InfoBox.prototype.delegateEvents = function(aerisInfoBox, gInfoBox) {
    // Proxy map events from the google maps marker view
    // over to the Aeris maps marker view,
    // so that the Marker object triggers its own events.
    _.each(this.eventMap_, function(aerisEvent, googleEvent) {
      google.maps.event.addListener(gInfoBox, googleEvent, function() {
        aerisInfoBox.trigger(aerisEvent);
      });
    }, this);

    this.layer_.on(this.layerEvents, this);
  };


  /**
   * @override
   * @param {Object} instance
   * @param {google.maps.InfoWindow} instance.popup
   * @param {google.maps.Marker} instance.marker
   * @param {google.maps.Map} map
   */
  aeris.maps.gmaps.layerstrategies.
  InfoBox.prototype.removeInstanceLayer = function(instance, map) {
    instance.popup.setMap(null);
    instance.marker.setMap(null);
    this.layer_.trigger('close');
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
  aeris.maps.gmaps.layerstrategies.
  InfoBox.prototype.onClose_ = function() {
    google.maps.event.clearInstanceListeners(this.marker_);
    google.maps.event.clearInstanceListeners(this.popup_);
    this.marker_.setMap(null);
    this.layer_.off(this.layerEvents, this);
  };


  return aeris.maps.gmaps.layerstrategies.InfoBox;

});
