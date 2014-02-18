define({
  $exports: { $ref: 'routeApp' },

  routeApp: {
    create: {
      module: 'aeris/builder/routes/routeapp/routeapp',
      args: [{
        layout: { $ref: 'mapAppLayout' },
        modules: { $ref: 'subModules' }
      }]
    }
  },

  mapState: { wire: 'aeris/builder/maps/mapapp/config/mapstate' },

  mapAppLayout: { wire: 'aeris/builder/maps/mapapp/config/layout' },

  subModules: { wire: 'aeris/builder/routes/routeapp/config/submodules' }
});
