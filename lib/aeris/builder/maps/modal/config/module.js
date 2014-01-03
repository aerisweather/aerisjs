define({
  $exports: { $ref: 'modalModule' },

  modalModule: {
    create: {
      module: 'mapbuilder/core/module/renderermodule',
      args: [{
        renderer: { $ref: 'modalViewRenderer' }
      }]
    }
  },

  modalViewRenderer: {
    create: {
      module: 'mapbuilder/core/helper/renderer',
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
    { module: 'application/plugin/regionresolver' },
    { module: 'application/plugin/events' }
  ]
});