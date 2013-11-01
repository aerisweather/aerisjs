/**
 * Context for the Markers module
 *
 * @class aeris.builder.maps.markers.config.context
 * @static
 */
define({
  markerStateCollection: {
    create: {
      module: 'mapbuilder/core/collection/mapobjectstatecollection',
      args: [undefined, {
        // Use MarkerState model with our state collection.
        model: { module: 'mapbuilder/markers/model/markerstate' }
      }]
    }
  },

  markersModule: {
    create: {
      module: 'mapbuilder/markers/module/markersmodule',
      args: [{
        layout: { $ref: 'mapAppLayout' },
        regionName: 'markerControls',

        appState: { $ref: 'appState' },
        appStateAttr: 'markers',
        moduleState: { $ref: 'markerStateCollection' },

        mapObjectController: { $ref: 'markerViewController' },
        selectController: { $ref: 'markerSelectController' },

        validFilters: { module: 'mapbuilder/markers/config/validmarkerfilters' }
      }]
    }
  },

  markerViewController: {
    create: {
      module: 'mapbuilder/core/controller/mapobjectcollectioncontroller',
      args: [{
        collection: { $ref: 'markerStateCollection' },
        itemView: { module: 'mapbuilder/markers/controller/markercontroller' },
        itemViewOptions: {
          appState: { $ref: 'appState' }
        }
      }]
    }
  },

  markerSelectController: {
    create: {
      module: 'application/form/controller/togglecollectioncontroller',
      args: [{
        collection: { $ref: 'markerStateCollection' },
        itemView: { module: 'mapbuilder/markers/controller/markertogglecontroller' },
        itemViewOptions: {
          className: 'aeris-markerTypeControls'
        }
      }]
    }
  }
});
