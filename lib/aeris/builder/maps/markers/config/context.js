/**
 * Context for the Markers module
 *
 * @property aeris.builder.maps.markers.config.context
 * @type {Object}
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
      module: 'mapbuilder/core/module/mapobjectmodule',
      args: [{
        layout: { $ref: 'mapAppLayout' },
        regionName: 'markerControls',

        appState: { $ref: 'appState' },
        appStateAttr: 'markers',
        moduleState: { $ref: 'markerStateCollection' },

        mapObjectController: { $ref: 'markerViewController' },
        selectController: { $ref: 'markerSelectController' }
      }]
    }
  },

  markerViewController: {
    create: {
      module: 'mapbuilder/core/controller/mapobjectcollectioncontroller',
      args: [{
        collection: { $ref: 'markerStateCollection' },
        itemViewOptions: {
          appState: { $ref: 'appState' }
        }
      }]
    }
  },

  markerSelectController: {
    create: {
      module: 'mapbuilder/core/controller/mapobjectselectcontroller',
      args: [{
        collection: { $ref: 'markerStateCollection' }
      }]
    }
  }
});
