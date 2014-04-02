define({
  builderOptions: {
    create: {
      module: 'aeris/builder/maps/options/mapappbuilderoptions',
      args: [
        null,
        {
          defaults: { wire: 'aeris/builder/maps/config/builderoptions' },
          mapObjectTypes: { wire: 'aeris/builder/maps/config/mapobjecttypes' }
        }
      ]
    }
  },

  eventHub: { create: 'aeris/builder/maps/event/eventhub' },

  appState: { create: 'aeris/builder/maps/core/models/state' },

  mapApp: { wire: 'aeris/builder/maps/mapapp/config/app' }
});
