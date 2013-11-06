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
      module: 'mapbuilder/map/mapmodule',
      args: [{
        mapController: { $ref: 'mapController' },

        appState: { $ref: 'appState' },
        appStateAttr: 'mapOptions',
        moduleState: { $ref: 'mapState' }
      }]
    },
    init: {
      setRegion: [ 'mapContainer', { $ref: 'mapAppLayout' } ]
    }
  },

  mapController: {
    create: {
      module: 'mapbuilder/map/controller/mapcontroller',
      args: [{
        appState: { $ref: 'appState' },
        className: 'aeris-map-canvas',
        model: { $ref: 'mapState' }
      }]
    }
  }
});
