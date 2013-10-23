define([
  // Note that Marionette puts
  // Wreqr into the Backbone namespace.
  'vendor/marionette'
], function(Marionette) {
  /**
   * The central event aggregator for the aeris MapAppBuilder.
   *
   * @property {Backbone.Wreqr.EventAggregator} aeris.builder.maps.vent
   */
  return new Backbone.Wreqr.EventAggregator();
});

/**
 * @memberof aeris.builder.maps.vent
 * @event map:set
 * @param {aeris.maps.Map} map The map which was set.
 */
/**
 * @memberof aeris.builder.maps.vent
 * @event map:remove
 * @param {null} map
 */
