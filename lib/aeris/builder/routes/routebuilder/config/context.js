/**
 * WireJS Spec for Routes App RouteBuilder module
 * @property aeris.builder.routes.routebuilder.config.context
 */
define({
  routeBuilderModule: {
    create: {
      module: 'routebuilder/routebuilder/routebuildermodule',
      args: [{
        layout: { $ref: 'mapAppLayout' },
        regionName: 'routeBuilderControls',
        controlsController: { $ref: 'routeBuilderControlsController' }
      }]
    }
  },

  routeBuilderControlsController: {
    create: {
      module: 'routebuilder/routebuilder/controller/controlscontroller',
      args: [{
        className: 'aeris-map-controls',
        template: { module: 'vendor/text!routebuilder/routebuilder/view/controls.html' },

        state: { $ref: 'appState' },
        routeBuilder: { $ref: 'routeBuilder' },

        ui: { $ref: 'routeBuilderControlsUI' }
      }]
    }
  },

  // UI Element definitions for routeBuilderControlsController
  routeBuilderControlsUI: {
    collapse: '.aeris-btn-collapse',
    controlsRegion: '.aeris-controls-region',
    followDirections: '.aeris-btn-followDirections',
    undo: '.aeris-btn-undo',
    redo: '.aeris-btn-redo',
    clear: '.aeris-btn-clear',
    latLonInputs: '.aeris-section-latlon input',
    latDeg: '.aeris-input-lat-deg',
    latMin: '.aeris-input-lat-min',
    latSec: '.aeris-input-lat-sec',
    lonDeg: '.aeris-input-lon-deg',
    lonMin: '.aeris-input-lon-min',
    lonSec: '.aeris-input-lon-sec',
    distance: '.aeris-distance'
  },

  routeBuilder: {
    create: {
      module: 'gmaps/route/routebuilder',
      args: [{
        travelMode: 'DRIVING',

        // RouteRenderer
        routeRenderer: {
          create: {
            module: 'gmaps/route/routerenderer'
          }
        },

        // Route
        route: {
          create: {
            module: 'gmaps/route/route'
          }
        }
      }]
    }
  }
});
