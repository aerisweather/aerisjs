define([
  'aeris/util'
], function() {
  return {
    infoPanelModule: {
      create: {
        module: 'mapbuilder/core/module/renderermodule',
        args: [{
          renderer: { $ref: 'infoPanelRenderer' }
        }]
      }
    },

    // Listens to event hub,
    // and renders transformed event data
    infoPanelRenderer: {
      create: {
        module: 'mapbuilder/core/helper/renderer',
        args: [{
          region: {
            $ref: 'region!infoPanel',
            layout: { $ref: 'mapAppLayout' }
          }
        }]
      },
      listenTo: {
        eventHub: {
          'info:view': 'show'
        }
      }
    }
  };
});

