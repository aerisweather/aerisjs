define({
  builderOptions: {
    create: {
      module: 'mapbuilder/options/mapappbuilderoptions',
      args: [
        null,
        {
          defaults: { wire: 'mapbuilder/config/builderoptions' },
          mapObjectTypes: { wire: 'mapbuilder/config/mapobjecttypes' }
        }
      ]
    }
  },

  eventHub: { create: 'mapbuilder/event/eventhub' },

  appState: { create: 'mapbuilder/core/model/state' },

  mapApp: { wire: 'mapbuilder/mapapp/config/app' }
});
