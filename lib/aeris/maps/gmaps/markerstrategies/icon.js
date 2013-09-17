define([
  'base/markerstrategy',
  'aeris/util',
  'gmaps/utils'
], function(MarkerStrategy, _, mapUtils) {

  /**
   * @fileoverview Icon marker strategy for Google Maps.
   */


  _.provide('aeris.maps.gmaps.markerstrategies.Icon');


  /**
   * A strategy for support of an Icon marker with Google Maps.
   *
   * @constructor
   * @class aeris.maps.gmaps.markerstrategies.Icon
   * @extends {aeris.maps.MarkerStrategy}
   */
  aeris.maps.gmaps.markerstrategies.Icon = function() {
    aeris.maps.MarkerStrategy.call(this);


    /**
     * Maps the names of google events to aeris Marker events
     * @type {Object}
     * @private
     */
    this.eventMap_ = {
      'click': 'click',
      'dragend': 'dragend'
    };
  };
  _.inherits(aeris.maps.gmaps.markerstrategies.Icon,
                 aeris.maps.MarkerStrategy);


  /**
   * @override
   */
  aeris.maps.gmaps.markerstrategies.Icon.prototype.setMarker =
      function(aerisMarker, map) {

    var gMarker = new google.maps.Marker({
      position: aeris.maps.gmaps.utils.arrayToLatLng(aerisMarker.position),
      icon: {
        url: aerisMarker.url,
        anchor: new google.maps.Point(aerisMarker.width / 2, aerisMarker.height / 2)
      },
      flat: true,
      clickable: aerisMarker.options.clickable,
      draggable: aerisMarker.options.draggable
    });

    if (aerisMarker.click) {
      google.maps.event.addListener(gMarker, 'click', aerisMarker.click);
    }

    this.delegateEvents(aerisMarker, gMarker);

    gMarker.setMap(map);

    return gMarker;
  };

  aeris.maps.gmaps.markerstrategies.Icon.prototype.setMarkerPosition = function(marker, latLon) {
    latLon = aeris.maps.gmaps.utils.arrayToLatLng(latLon);
    marker.setPosition(latLon);
  };


  aeris.maps.gmaps.markerstrategies.Icon.prototype.removeMarker = function(gMarker) {
    this.unbindMapEvents(gMarker);
    gMarker.setMap(null);
    gMarker = null;
  };


  /**
   * Proxy map events from the google maps marker view
   * over to the Aeris maps marker view,
   * so that the Marker object triggers its own events.
   *
   * Events are defined in this.eventMap_.
   *
   * @param {aeris.maps.Marker} aerisMarker
   * @param {google.maps.Marker} gMarker
   */
  aeris.maps.gmaps.markerstrategies.Icon.prototype.delegateEvents = function(aerisMarker, gMarker) {
    _.each(this.eventMap_, function(markerEvent, googleEvent) {
      google.maps.event.addListener(gMarker, googleEvent, function(evt) {
        var latLon = evt.latLng ?
          mapUtils.latLngToArray(evt.latLng) : undefined;

        aerisMarker.trigger(markerEvent, latLon);
      });
    }, this);
  };

  aeris.maps.gmaps.markerstrategies.Icon.prototype.unbindMapEvents = function(gMarker) {
    _.each(this.eventMap_, function(markerEvent, googleEvent) {
      google.maps.event.clearListeners(gMarker, googleEvent);
    });
  };


  return aeris.maps.gmaps.markerstrategies.Icon;

});
