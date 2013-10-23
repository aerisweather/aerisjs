define([
  'mapbuilder/mapapp/config/context',
  // Required to use marionette AMD-wrapped modules
  'vendor/marionette-amd'
], function(mapAppContext) {
  /**
   * @property aeris.builder.routes.routeapp.config.context
   * @type {Object}
   */
  return {
    // Use the base mapApp configuration
    routeApp: { $ref: 'mapApp' },

    // Override mapAppTemplate
    mapAppTemplate: {
      module: 'vendor/text!routebuilder/routeapp/view/app.html'
    },

    // Override mapAppRegions
    mapAppRegions: _.extend({}, mapAppContext.mapAppRegions, {
      routeBuilderControls: '#aeris-routeBuilderControls'
    }),

    // Override mapAppSubModules
    mapAppSubModules: _.extend({}, mapAppContext.mapAppSubModules, {
      routeBuilderModule: { $ref: 'routeBuilderModule' }
    })
  };
});
