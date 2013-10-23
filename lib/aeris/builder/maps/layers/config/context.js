/**
 * Context for the Layers module
 *
 * @property aeris.builder.maps.layers.config.context
 * @type {Object}
 */
define({
  layersCollection: {
    create: {
      module: 'mapbuilder/core/collection/mapobjectstatecollection'
    }
  },

  layersModule: {
    create: {
      module: 'mapbuilder/core/module/mapobjectmodule',
      args: [{
        layout: { $ref: 'mapAppLayout' },
        regionName: 'layerControls',

        labelLookup: { $ref: 'labelLookup' },

        state: { $ref: 'appState' },
        stateAttr: 'layers',
        stateItems: { $ref: 'layersCollection' },

        mapObjectController: { $ref: 'layerCollectionController' },
        selectController: { $ref: 'layerSelectController' }
      }]
    }
  },

  layerCollectionController: {
    create: {
      module: 'mapbuilder/core/controller/mapobjectcollectioncontroller',
      args: [{
        itemViewOptions: {
          mapObjectNS: 'aeris.maps.layers'
        },
        collection: { $ref: 'layersCollection' }
      }]
    }
  },

  layerSelectController: {
    create: {
      module: 'mapbuilder/core/controller/mapobjectselectcontroller',
      args: [{
        itemViewOptions: {
          stateItems: { $ref: 'layersCollection' }
        }
      }]
    }
  },

  // This could be replaced
  // by a i8n plugin (eg, with the hbs loader)
  labelLookup: {
    'AerisAdvisories': 'Advisories',
    'AerisAdvisoriesKML': 'Advisories',
    'AerisChlorophyll': 'Chlorophyll',
    'AerisConvectiveHazard': 'Convective',
    'AerisDewPoints': 'Dew Points',
    'AerisHeatIndex': 'Heat Index',
    'AerisHumidity': 'Humidity',
    'AerisRadar': 'Radar',
    'AerisSatellite': 'Satellite',
    'AerisSatelliteVisible': 'Visible Satellite',
    'AerisSatelliteGlobal': 'Satellite',
    'AerisSeaSurfaceTemps': 'Sea Surface Temps',
    'AerisSnowDepth': 'Snow Depth',
    'AerisTemps': 'Temperature',
    'AerisWindChill': 'Wind Chill',
    'AerisWinds': 'Wind Speed'
  }
});
