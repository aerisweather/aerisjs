define([
  'aeris/util',
  'mapbuilder/mapcontrols/config/context'
], function(_, baseCtx) {
  /**
   * WireJS spec for the Routes app MapControls module
   * module.
   *
   * @class aeris.builder.routes.mapcontrols.config.context
   */
  return {
    mapControlsRegions: _.extend({}, baseCtx.mapControlsRegions, {
      routeBuilderControlsRegion: '.routeBuilderControls'
    }),

    mapControlsControllerRegions: _.extend({}, baseCtx.mapControlsControllerRegions, {
      routeBuilder: 'routeBuilderControlsRegion'
    }),

    mapControlsTemplate: { module: 'hbs!routebuilder/mapcontrols/view/controls.html' }
  };
});
