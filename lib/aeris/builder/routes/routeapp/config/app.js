define({
  $exports: { $ref: 'routeApp' },

  routeApp: {
    create: {
      module: 'ai/builder/routes/routeapp/routeapp',
      args: [{
        layout: { $ref: 'mapAppLayout' },
        modules: { $ref: 'subModules' }
      }]
    }
  },

  mapState: { wire: 'ai/builder/maps/mapapp/config/mapstate' },

  mapAppLayout: { wire: 'ai/builder/maps/mapapp/config/layout' },

  subModules: { wire: 'ai/builder/routes/routeapp/config/submodules' }
});
