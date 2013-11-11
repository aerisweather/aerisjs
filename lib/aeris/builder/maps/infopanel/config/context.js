define([
  'aeris/util'
], function() {
  return {
    infoPanelModule: {
      create: {
        module: 'mapbuilder/infopanel/module/infopanelmodule',
        args: [{
          infoRenderer: { $ref: 'infoPanelRenderer' }
        }]
      }
    },

    // Listens to event hub,
    // and renders transformed event data
    infoPanelRenderer: {
      create: {
        module: 'mapbuilder/infopanel/controller/inforenderer',
        args: [{
          infoPanelRegion: {
            $ref: 'region!infoPanel',
            layout: { $ref: 'mapAppLayout' }
          }
        }]
      },
      listenTo: {
        eventHub: {
          'info:view': 'showView'
        }
      }
    }
  };
});

