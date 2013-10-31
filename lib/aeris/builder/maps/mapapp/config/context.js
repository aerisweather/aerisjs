/**
 * Context for the MapApp application.
 *
 * @class aeris.builder.maps.mapapp.config.context
 * @static
 */
define([
  // Must load Marionette-amd Module definitions
  // in order for Wire JS to have access to wrapped
  // Marionette modules (eg 'vendor/marionette/layout')
  'vendor/marionette-amd'
], function() {
  return {

    mapAppTemplate: {
      module: 'vendor/text!mapbuilder/mapapp/view/app.html'
    },

    mapAppRegions: {
      layerControls: '#aeris-layerControls',
      markerControls: '#aeris-markerControls',
      mapContainer: '#aeris-mapContainer'
    },

    mapAppLayout: {
      create: {
        module: 'vendor/marionette/layout',
        args: [{
          template: { $ref: 'mapAppTemplate' },
          className: 'aeris-fullScreen aeris-maps-app'
        }]
      },
      init: {
        // Think of this as setter-injection
        addRegions: [{ $ref: 'mapAppRegions' }],

        // Render our layout right away
        render: []
      }
    },

    mapAppSubModules: {
      map: { $ref: 'mapModule' },
      markers: { $ref: 'markersModule' },
      layers: { $ref: 'layersModule' }
    },

    mapApp: {
      create: {
        module: 'mapbuilder/core/module/application',
        args: [{
          layout: { $ref: 'mapAppLayout' },

          // MapApp will start these modules
          // with the application.
          modules: { $ref: 'mapAppSubModules' },

          router: { $ref: 'appRouter' }
        }]
      }
    }
  };
});
