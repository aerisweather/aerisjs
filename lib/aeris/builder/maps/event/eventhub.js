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

  /**
   * A map controls view has been created
   * and rendered.
   *
   * @event 'mapControls:render'
   *
   * @param {Backbone.View} controller
   * @param {string} Name of the controller.
   */
  return Events;
});
