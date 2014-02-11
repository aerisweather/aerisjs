define({
  eventHub: { create: 'ai/builder/maps/event/eventhub' },

  appState: { create: 'ai/builder/maps/core/models/state' },

  builderOptions: {
    create: {
      module: 'ai/builder/routes/options/routebuilderoptions',
      args: [
        null,
        {
          defaults: { wire: 'ai/builder/routes/config/builderoptions' },
          mapObjectTypes: { wire: 'ai/builder/maps/config/mapobjecttypes' }
        }
      ]
    }
  },

  routeApp: { wire: 'ai/builder/routes/routeapp/config/app' }
});