/**
 * Context for the Map module.
 *
 * @property aeris.builder.maps.map.config.context
 * @type {Object}
 */
define({
  $exports: { $ref: 'mapModule' },

  mapModule: {
    create: {
      module: 'ai/builder/maps/map/module/mapmodule',
      args: [{
        mapController: { $ref: 'mapController' },

        appState: { $ref: 'appState' },
        appStateAttr: 'mapOptions',
        moduleState: { $ref: 'mapState' },

        mapCanvasRegion: {
          $ref: 'region!mapCanvas',
          layout: { $ref: 'mapAppLayout' }
        }
      }]
    }
  },

  mapController: {
    create: {
      module: 'ai/builder/maps/map/controller/mapcontroller',
      args: [{
        appState: { $ref: 'appState' },
        className: 'mapCanvas',
        model: { $ref: 'mapState' }
      }]
    }
  },

  $plugins: [
    { module: 'ai/application/plugin/regionresolver' }
  ]
});
