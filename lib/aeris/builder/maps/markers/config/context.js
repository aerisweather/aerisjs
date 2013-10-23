/**
 * Context for the Markers module
 *
 * @property aeris.builder.maps.markers.config.context
 * @type {Object}
 */
define({
  markersCollection: {
    create: {
      module: 'mapbuilder/core/collection/mapobjectstatecollection'
    }
  },

  markersModule: {
    create: {
      module: 'mapbuilder/core/module/mapobjectmodule',
      args: [{
        layout: { $ref: 'mapAppLayout' },
        regionName: 'markerControls',

        labelLookup: { $ref: 'labelLookup' },

        state: { $ref: 'appState' },
        stateAttr: 'markers',
        stateItems: { $ref: 'markersCollection' },

        mapObjectController: { $ref: 'markerCollectionController' },
        selectController: { $ref: 'markerSelectController' }
      }]
    }
  },

  markerCollectionController: {
    create: {
      module: 'mapbuilder/core/controller/mapobjectcollectioncontroller',
      args: [{
        itemViewOptions: {
          mapObjectNS: 'aeris.maps'
        },
        collection: { $ref: 'markersCollection' }
      }]
    }
  },

  markerSelectController: {
    create: {
      module: 'mapbuilder/core/controller/mapobjectselectcontroller',
      args: [{
        itemViewOptions: {
          stateItems: { $ref: 'markersCollection' }
        }
      }]
    }
  },

  // This could be replaced
  // by a i8n plugin (eg, with the hbs loader)
  labelLookup: {
    'EarthquakeMarkers': 'Earthquakes',
    'FireMarkers': 'Fires',
    'StormReportMarkers': 'Storm Reports',
    'LightningMarkers': 'Lightning'
  }
});
