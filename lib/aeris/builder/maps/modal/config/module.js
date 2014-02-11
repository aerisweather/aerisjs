define({
  $exports: { $ref: 'modalModule' },

  modalModule: {
    create: {
      module: 'ai/builder/maps/core/modules/renderermodule',
      args: [{
        renderer: { $ref: 'modalViewRenderer' }
      }]
    }
  },

  modalViewRenderer: {
    create: {
      module: 'ai/builder/maps/core/helpers/renderer',
      args: [{
        region: {
          $ref: 'region!modal',
          layout: { $ref: 'mapAppLayout' }
        }
      }]
    },
    listenTo: {
      eventHub: {
        'modal:view': 'show'
      }
    }
  },

  $plugins: [
    { module: 'ai/application/plugin/regionresolver' },
    { module: 'ai/application/plugin/events' }
  ]
});