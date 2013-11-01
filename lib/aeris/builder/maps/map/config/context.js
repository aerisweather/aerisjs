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
        layout: { $ref: 'mapAppLayout' },
        regionName: 'mapContainer',              // Module will have to set this.region_ = opts.layout_[opts.region],
        mapController: { $ref: 'mapController' },

        appState: { $ref: 'appState' },
        appStateAttr: 'mapOptions',
        moduleState: { $ref: 'mapState' }
      }]
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
