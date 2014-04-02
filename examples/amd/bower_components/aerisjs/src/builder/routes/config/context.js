define({
  eventHub: { create: 'aeris/builder/maps/event/eventhub' },

  appState: { create: 'aeris/builder/maps/core/models/state' },

  builderOptions: {
    create: {
      module: 'aeris/builder/routes/options/routebuilderoptions',
      args: [
        null,
        {
          defaults: { wire: 'aeris/builder/routes/config/builderoptions' },
          mapObjectTypes: { wire: 'aeris/builder/maps/config/mapobjecttypes' }
        }
      ]
    }
  },

  routeApp: { wire: 'aeris/builder/routes/routeapp/config/app' }
});
