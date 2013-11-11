define([
  'aeris/util',
  'aeris/events'
], function(_, Events) {
  /**
   * Application event hub
   *
   * @class aeris.builder.maps.event.EventHub
   * @extends aeris.Events
   */

  /**
   * @event 'marker:click'
   * @param {Array.<number>} latLon Marker location.
   * @param {aeris.maps.markers.PointDataMarker} marker Marker object.
   */

  /**
   * An info view has been created,
   * and is available for rendering.
   *
   * @event 'info:view'
   * @param {Backbone.View} view
   */
  return Events;
});
