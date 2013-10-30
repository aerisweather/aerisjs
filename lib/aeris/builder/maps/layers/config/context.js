/**
 * Context for the Layers module
 *
 * @property aeris.builder.maps.layers.config.context
 * @type {Object}
 */
define({

  layerStateCollection: {
    create: {
      module: 'mapbuilder/core/collection/mapobjectstatecollection',
      args: [
        undefined,
        {
          // use the LayerState model
          model: { module: 'mapbuilder/layers/model/layerstate' }
        }
      ]
    }
  },

  layersModule: {
    create: {
      module: 'mapbuilder/core/module/mapobjectmodule',
      args: [{
        layout: { $ref: 'mapAppLayout' },
        regionName: 'layerControls',

        appState: { $ref: 'appState' },
        appStateAttr: 'layers',
        moduleState: { $ref: 'layerStateCollection' },

        mapObjectController: { $ref: 'layerViewController' },
        selectController: { $ref: 'layerSelectController' }
      }]
    }
  },

  layerViewController: {
    create: {
      module: 'mapbuilder/core/controller/mapobjectcollectioncontroller',
      args: [{
        collection: { $ref: 'layerStateCollection' },
        itemViewOptions: {
          appState: { $ref: 'appState' }
        }
      }]
    }
  },

  layerSelectController: {
    create: {
      module: 'mapbuilder/core/controller/mapobjectselectcontroller',
      args: [{
        collection: { $ref: 'layerStateCollection' }
      }]
    }
  }
});
