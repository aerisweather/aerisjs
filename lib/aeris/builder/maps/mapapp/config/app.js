/**
 * Context for the MapApp application.
 *
 * @class context
 * @namespace aeris.builder.maps.mapapp.config
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
