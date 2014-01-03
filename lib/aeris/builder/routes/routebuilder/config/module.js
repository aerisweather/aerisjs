/**
 * WireJS Spec for Routes App RouteBuilder module
 * @class aeris.builder.routes.routebuilder.config.context
 * @static
 */
define({
  $exports: { $ref: 'routeBuilderModule' },

  routeBuilderModule: {
    create: {
      module: 'routeappbuilder/routebuilder/module/routebuildermodule',
      args: [
        {
          routeControlsController: { $ref: 'routeControlsController' },
          routeBuilderController: { $ref: 'routeBuilderController' },
          eventHub: { $ref: 'eventHub' },
          appState: { $ref: 'appState' },
          modules: {
            routePointInfo: { $ref: 'routePointInfoModule' }
          }
        }
      ]
    }
  },

  routePointInfoModule: { wire: 'routeappbuilder/routebuilder/routepointinfo/config/module' },

  routeBuilderController: {
    create: {
      module: 'routeappbuilder/routebuilder/controller/routebuildercontroller',
      args: [
        {
          routeBuilder: { $ref: 'routeBuilder' },
          RoutePoint: { $ref: 'RoutePointFactory' }
        }
      ]
    }
  },

  RoutePointFactory: {
    module: 'strategy/route/waypoint'
  },

  routeControlsController: {
    create: {
      module: 'routeappbuilder/routebuilder/controller/routecontrolscontroller',
      args: [
        {
          tagName: 'section',
          template: { module: 'hbars!routeappbuilder/routebuilder/view/controls.html' },

          eventHub: { $ref: 'eventHub' },
          routeBuilder: { $ref: 'routeBuilder' },

          SaveRouteController: { $ref: 'SaveRouteController' },

          openStateClass: 'state-open',
          closedStateClass: 'state-closed',

          ui: { $ref: 'routeControlsUI' },

          regions: {
            travelMode: '.aeris-travelMode-region'
          },

          regionControllers: {
            travelMode: { $ref: 'travelModeController' }
          }
        }
      ]
    }
  },

  // UI Element definitions for routeControlsController
  routeControlsUI: {
    collapseBtn: 'h1',
    controlsRegion: '.aeris-controls-region',
    followDirectionsToggleBtn: '.aeris-btn-followDirections',
    undoBtn: '.aeris-btn-undo',
    redoBtn: '.aeris-btn-redo',
    clearBtn: '.aeris-btn-clear',
    saveBtn: '.aeris-btn-save',
    returnRouteBtn: '.aeris-btn-returnRoute',
    distance: '.aeris-distance'
  },

  routeBuilder: {
    create: {
      module: 'strategy/route/routebuilder',
      args: [
        {
          travelMode: { $ref: 'routeBuilderOptions.travelMode' },
          followDirections: { $ref: 'routeBuilderOptions.followDirections' },
          styles: { $ref: 'routeBuilderOptions.styles' },

          routeRenderer: { $ref: 'routeRenderer' },
          route: { $ref: 'route' }
        }
      ]
    }
  },

  routeBuilderOptions: {
    travelMode: { $ref: 'travelMode!DRIVING' },
    followDirections: true,
    styles: {}
  },

  routeRenderer: {
    create: {
      module: 'strategy/route/routerenderer',
      args: [
        {
          offPath: {
            strokeColor: '#c70402',
            strokeWeight: 5,
            strokeOpacity: 0.9
          },
          waypoint: {
            url: { $ref: 'assetPath!polaris/markers/small/routepoint.png' },
            offsetX: 12,
            offsetY: 36
          },
          selectedWaypoint: {
            url: { $ref: 'assetPath!polaris/markers/small/routepoint_selected.png' },
            offsetX: 25,
            offsetY: 36
          }
        }
      ]
    }
  },

  route: {
    create: 'strategy/route/route'
  },


  travelModeController: {
    create: {
      module: 'routeappbuilder/routebuilder/controller/travelmodecontroller',
      args: [
        {
          collection: {
            create: {
              module: 'application/form/collection/radiocollection',
              args: [
                { $ref: 'travelModes' }
              ]
            }
          },
          itemViewOptions: {
            selectedClass: '',
            deselectedClass: 'aeris-disabled'
          },

          routeBuilder: { $ref: 'routeBuilder' }
        }
      ]
    }
  },


  travelModes: [
    {
      value: { $ref: 'travelMode!DRIVING' },
      label: 'Driving'
    },
    {
      value: {$ref: 'travelMode!BICYCLING' },
      label: 'Bicycling'
    },
    {
      value: { $ref: 'travelMode!WALKING' },
      label: 'Walking'
    }
  ],


  SaveRouteController: {
    ClassFactory: {
      module: 'routeappbuilder/routebuilder/controller/saveroutecontroller',
      args: [
        {
          template: {
            module: 'hbars!routeappbuilder/routebuilder/view/saverouteform.html'
          },
          ui: {
            nameInput: '.aeris-routeNameInput',
            descrInput: '.aeris-routeDescrInput',
            saveBtn: '.aeris-save',
            closeBtn: '.aeris-close',
            loading: '.aeris-loading',
            errorMsg: '.aeris-formError',
            distance: '.aeris-distance',
            length: '.aeris-length'
          },

          routeBuilder: { $ref: 'routeBuilder' },
          eventHub: { $ref: 'eventHub' },
          RouteModel: {
            module: 'polaris/api/route/model/usergeneratedroute'
          }
        }
      ]
    }
  },

  $plugins: [
    { module: 'routeappbuilder/plugin/travelmode' },
    { module: 'application/plugin/assetPath' },
    { module: 'application/plugin/classfactory' }
  ]
});
