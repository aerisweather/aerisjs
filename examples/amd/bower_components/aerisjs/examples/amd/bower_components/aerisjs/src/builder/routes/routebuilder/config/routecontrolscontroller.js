define({
  $exports: { $ref: 'routeControlsController' },

  routeControlsController: {
    create: {
      module: 'aeris/builder/routes/routebuilder/controllers/routecontrolscontroller',
      args: [
        {
          tagName: 'section',
          template: { module: 'hbars!aeris/builder/routes/routebuilder/views/controls.html' },

          eventHub: { $ref: 'eventHub' },
          routeBuilder: { $ref: 'routeBuilder' },

          SaveRouteController: { $ref: 'SaveRouteController' },

          openStateClass: 'aeris-state-open',
          closedStateClass: 'aeris-state-closed',

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


  SaveRouteController: {
    ClassFactory: {
      module: 'aeris/builder/routes/routebuilder/controllers/saveroutecontroller',
      args: [
        {
          template: {
            module: 'hbars!aeris/builder/routes/routebuilder/views/saverouteform.html'
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
          RouteModel: { $ref: 'RouteFormModel' }
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


  RouteFormModel: { module: 'aeris/model' },


  travelModeController: {
    create: {
      module: 'aeris/builder/routes/routebuilder/controllers/travelmodecontroller',
      args: [
        {
          collection: {
            create: {
              module: 'aeris/application/forms/collections/radiocollection',
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


  $plugins: [
    { module: 'aeris/builder/routes/plugins/travelmode' },
    { module: 'aeris/application/plugins/classfactory' }
  ]

});
