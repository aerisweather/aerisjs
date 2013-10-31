define([
  'mapbuilder/mapapp/config/context',
  // Required to use marionette AMD-wrapped modules
  'vendor/marionette-amd'
], function(mapAppContext) {
  /**
   * WireJS Spec for the Aeris Routes main application module..
   *
   * @class aeris.builder.routes.routeapp.config.context
   * @extends aeris.builder.maps.mapapp.config.context
   *
   * @static
   */
  return {
    // Alias the base mapApp object
    routeApp: { $ref: 'mapApp' },

    // Override mapAppTemplate
    mapAppTemplate: {
      module: 'vendor/text!routebuilder/routeapp/view/app.html'
    },

    // Override mapAppRegions
    mapAppRegions: _.extend({}, mapAppContext.mapAppRegions, {
      routeBuilderControls: '#aeris-routeBuilderControls'
    }),

    // Define submodules to start with application
    routeAppSubModules: _.extend({},
      // Include modules defined by the map app config.
      mapAppContext.mapAppSubModules,
      {
        routeBuilderModule: { $ref: 'routeBuilderModule' }
      }
    ),

    // Override mapAppSubModules
    mapAppSubModules: { $ref: 'routeAppSubModules' }
  };
});
