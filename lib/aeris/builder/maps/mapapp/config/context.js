/**
 * Context for the MapApp application.
 *
 * @property aeris.builder.maps.mapapp.config.context
 * @type {Object}
 */
define({
  mapAppLayout: {
    create: {
      module: 'vendor/marionette/layout',
      args: [{
        template: {
          module: 'vendor/text!mapbuilder/mapapp/view/app.html'
        },
        className: 'aeris-fullScreen aeris-maps-app'
      }]
    },
    init: {
      // Think of this as setter-injection
      addRegions: [{
        layerControls: '#aeris-layerControls',
        markerControls: '#aeris-markerControls',
        poiControls: '#aeris-poiControls',
        routeControls: '#aeris-routeControls',
        mapContainer: '#aeris-mapContainer'
      }],

      // Render our layout right away
      render: []
    }
  },

  mapApp: {
    create: {
      module: 'mapbuilder/mapapp/mapapp',
      args: [{
        layout: { $ref: 'mapAppLayout' },

        // MapApp will start these modules
        // with the application.
        modules: {
          map: { $ref: 'mapModule' },
          markers: { $ref: 'markersModule' },
          layers: { $ref: 'layersModule' }
        },

        router: { $ref: 'appRouter' }
      }]
    }
  }
});
