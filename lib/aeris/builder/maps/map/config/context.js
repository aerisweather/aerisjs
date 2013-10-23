/**
 * Context for the Map module.
 *
 * @property aeris.builder.maps.map.config.context
 * @type {Object}
 */
define({
  mapModule: {
    create: {
      module: 'mapbuilder/map/mapmodule',
      args: [{
        layout: { $ref: 'mapAppLayout' },
        regionName: 'mapContainer',              // Module will have to set this.region_ = opts.layout_[opts.region],
        mapController: { $ref: 'mapController' }
      }]
    }
  },

  mapController: {
    create: {
      module: 'mapbuilder/map/controller/mapcontroller',
      args: [{
        state: { $ref: 'appState' },
        className: 'aeris-map-canvas'
      }]
    }
  }
});
