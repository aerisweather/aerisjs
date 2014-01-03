define({
  $exports: { $ref: 'routeApp' },

  routeApp: {
    create: {
      module: 'routeappbuilder/routeapp/routeapp',
      args: [{
        layout: { $ref: 'mapAppLayout' },
        modules: { $ref: 'subModules' }
      }]
    }
  },

  mapState: { wire: 'mapbuilder/mapapp/config/mapstate' },

  mapAppLayout: { wire: 'mapbuilder/mapapp/config/layout' },

  subModules: { wire: 'routeappbuilder/routeapp/config/submodules' }
});
