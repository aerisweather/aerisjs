define([
  'aeris/util',
  'mapbuilder/mapapp/config/context',
  // Required to use marionette AMD-wrapped modules
  'vendor/marionette-amd'
], function(_, mapAppContext) {
  /**
   * WireJS Spec for the Aeris Routes main application module..
   *
   * @class aeris.builder.routes.routeapp.config.context
   * @extends aeris.builder.maps.mapapp.config.context
   *
   * @static
   */
  return {
    // Extend the base mapApp object
    routeApp: _.extendFactorySpec(mapAppContext.mapApp, {
      create: {
        module: 'routebuilder/routeapp/routeapp'
      }
    }),

    // Define submodules to start with application
    routeAppSubModules: _.extend({},
      // Include modules defined by the map app config.
      mapAppContext.mapAppSubModules,
      {
        routeBuilder: { $ref: 'routeBuilderModule' }
      }
    ),

    // Override mapAppSubModules
    mapAppSubModules: { $ref: 'routeAppSubModules' }
  };
});
