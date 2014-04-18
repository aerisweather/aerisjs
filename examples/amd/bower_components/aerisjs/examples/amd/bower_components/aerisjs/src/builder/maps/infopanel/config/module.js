define({
  $exports: { $ref: 'infoPanelModule' },

  infoPanelModule: {
    create: {
      module: 'aeris/builder/maps/core/modules/renderermodule',
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
      module: 'aeris/builder/maps/infopanel/helpers/infopanelrenderer',
      args: [
        {
          region: {
            $ref: 'region!infoPanel',
            layout: { $ref: 'mapAppLayout' }
          },
          eventHub: { $ref: 'eventHub' }
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
    { module: 'aeris/application/plugins/regionresolver' },
    { module: 'aeris/application/plugins/events' }
  ]
});
/**
 * @for aeris.builder.maps.event.EventHub
 */
/**
 * And info panel view is ready to be rendered.
 *
 * @event info:view
 * @param {aeris.application.controllers.ControllerInterface} infoViewController
 */
