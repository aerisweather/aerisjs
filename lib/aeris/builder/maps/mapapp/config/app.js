/**
 * Context for the MapApp application.
 *
 * @class aeris.builder.maps.mapapp.config.context
 * @static
 */
define({
  $exports: { $ref: 'mapApp' },

  mapAppLayout: { wire: 'mapbuilder/mapapp/config/layout' },

  mapState: { wire: 'mapbuilder/mapapp/config/mapstate' },

  subModules: { wire: 'mapbuilder/mapapp/config/submodules' },

  mapApp: {
    create: {
      module: 'application/module/application',
      args: [
        {
          layout: { $ref: 'mapAppLayout' },
          modules: { $ref: 'subModules' }
        }
      ]
    }
  }
});
