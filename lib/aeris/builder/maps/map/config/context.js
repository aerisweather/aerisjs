/**
 * Context for the Map module.
 *
 * @property aeris.builder.maps.map.config.context
 * @type {Object}
 */
define({

  mapState: {
    create: {
      module: 'aeris/model'
    }
  },

  mapModule: {
    create: {
      module: 'mapbuilder/map/module/mapmodule',
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
      module: 'mapbuilder/map/controller/mapcontroller',
      args: [{
        appState: { $ref: 'appState' },
        className: 'mapCanvas',
        model: { $ref: 'mapState' }
      }]
    }
  }
});
