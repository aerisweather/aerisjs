/**
 * Context for the MapApp application.
 *
 * @class context
 * @namespace aeris.builder.maps.mapapp.config
 * @static
 */
define({
  $exports: { $ref: 'mapApp' },

  mapAppLayout: { wire: 'aeris/builder/maps/mapapp/config/layout' },

  mapState: { wire: 'aeris/builder/maps/mapapp/config/mapstate' },

  subModules: { wire: 'aeris/builder/maps/mapapp/config/submodules' },

  mapApp: {
    create: {
      module: 'aeris/application/modules/application',
      args: [
        {
          layout: { $ref: 'mapAppLayout' },
          modules: { $ref: 'subModules' }
        }
      ]
    }
  }
});
