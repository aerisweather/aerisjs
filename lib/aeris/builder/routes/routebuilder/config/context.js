/**
 * WireJS Spec for Routes App RouteBuilder module
 * @property aeris.builder.routes.routebuilder.config.context
 */
define({
  routeBuilderModule: {
    create: {
      module: 'routebuilder/routebuilder/module/routebuildermodule',
      args: [{
        routeControlsController: { $ref: 'routeBuilderControlsController' },
        eventHub: { $ref: 'eventHub' }
      }]
    }
  },

  routeBuilderControlsController: {
    create: {
      module: 'routebuilder/routebuilder/controller/controlscontroller',
      args: [{
        tagName: 'section',
        template: { module: 'hbs!routebuilder/routebuilder/view/controls.html' },

        state: { $ref: 'appState' },
        routeBuilder: { $ref: 'routeBuilder' },

        openStateClass: 'state-open',
        closedStateClass: 'state-closed',

        ui: { $ref: 'routeBuilderControlsUI' },

        regions: {
          travelMode: '.aeris-travelMode-region'
        },

        regionControllers: {
          travelMode: { $ref: 'travelModeController' }
        }
      }]
    }
  },

  // UI Element definitions for routeBuilderControlsController
  routeBuilderControlsUI: {
    collapseBtn: 'h1',
    controlsRegion: '.aeris-controls-region',
    followDirectionsToggleBtn: '.aeris-btn-followDirections',
    undoBtn: '.aeris-btn-undo',
    redoBtn: '.aeris-btn-redo',
    clearBtn: '.aeris-btn-clear',
    returnRouteBtn: '.aeris-btn-returnRoute',
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
  },


  travelModeController: {
    create: {
      module: 'routebuilder/routebuilder/controller/travelmodecontroller',
      args: [{
        collection: {
          create: {
            module: 'application/form/collection/radiocollection',
            args: [{ $ref: 'travelModes' }]
          }
        },
        itemViewOptions: {
          selectedClass: '',
          deselectedClass: 'aeris-disabled'
        },

        routeBuilder: { $ref: 'routeBuilder' }
      }]
    }
  },


  travelModes: [
    {
      value: 'DRIVING',
      label: 'Driving'
    },
    {
      value: 'BICYCLING',
      label: 'Bicycling'
    },
    {
      value: 'WALKING',
      label: 'Walking'
    }
  ]
});
