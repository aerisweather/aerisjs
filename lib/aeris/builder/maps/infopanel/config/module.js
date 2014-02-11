define({
  $exports: { $ref: 'infoPanelModule' },

  infoPanelModule: {
    create: {
      module: 'ai/builder/maps/core/modules/renderermodule',
      args: [
        {
          renderer: { $ref: 'infoPanelRenderer' }
        }
      ]
    }
  },

  // Listens to event hub,
  // and renders transformed event data
  infoPanelRenderer: {
    create: {
      module: 'ai/builder/maps/core/helpers/renderer',
      args: [
        {
          region: {
            $ref: 'region!infoPanel',
            layout: { $ref: 'mapAppLayout' }
          }
        }
      ]
    },
    listenTo: {
      eventHub: {
        'info:view': 'show'
      }
    }
  },

  $plugins: [
    { module: 'ai/application/plugins/regionresolver' },
    { module: 'ai/application/plugins/events' }
  ]
});

