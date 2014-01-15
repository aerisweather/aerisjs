define({
  builderOptions: {
    create: {
      module: 'ai/builder/maps/options/mapappbuilderoptions',
      args: [
        null,
        {
          defaults: { wire: 'ai/builder/maps/config/builderoptions' },
          mapObjectTypes: { wire: 'ai/builder/maps/config/mapobjecttypes' }
        }
      ]
    }
  },

  eventHub: { create: 'ai/builder/maps/event/eventhub' },

  appState: { create: 'ai/builder/maps/core/model/state' },

  mapApp: { wire: 'ai/builder/maps/mapapp/config/app' }
});
