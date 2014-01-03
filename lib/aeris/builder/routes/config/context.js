define({
  eventHub: { create: 'mapbuilder/event/eventhub' },

  appState: { create: 'mapbuilder/core/model/state' },

  builderOptions: {
    create: {
      module: 'routeappbuilder/options/routebuilderoptions',
      args: [
        null,
        {
          defaults: { wire: 'routeappbuilder/config/builderoptions' },
          mapObjectTypes: { wire: 'mapbuilder/config/mapobjecttypes' }
        }
      ]
    }
  },

  routeApp: { wire: 'routeappbuilder/routeapp/config/app' }
});