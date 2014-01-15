/**
 * Context for the MapApp application.
 *
 * @class aeris.builder.maps.mapapp.config.context
 * @static
 */
define({
  $exports: { $ref: 'mapApp' },

  mapAppLayout: { wire: 'ai/builder/maps/mapapp/config/layout' },

  mapState: { wire: 'ai/builder/maps/mapapp/config/mapstate' },

  subModules: { wire: 'ai/builder/maps/mapapp/config/submodules' },

  mapApp: {
    create: {
      module: 'ai/application/module/application',
      args: [
        {
          layout: { $ref: 'mapAppLayout' },
          modules: { $ref: 'subModules' }
        }
      ]
    }
  }
});
