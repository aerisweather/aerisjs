/**
 * Context for the Layers module
 *
 * @property aeris.builder.maps.layers.config.context
 * @type {Object}
 */
define({

  layerState: {
    create: {
      module: 'aeris/classfactory',
      args: [
        { module: 'mapbuilder/core/model/mapobjectstate' },
        [undefined, {
          namespace: 'aeris.maps.layers'
        }],
        { extendArgObjects: true }
      ]
    }
  },

  layerStateCollection: {
    create: {
      module: 'mapbuilder/core/collection/mapobjectstatecollection',
      args: [
        undefined,
        {
          // use the LayerState model
          model: {$ref: 'layerState' }
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
      module: 'application/form/controller/togglecollectioncontroller',
      args: [{
        collection: { $ref: 'layerStateCollection' },
        itemViewOptions: {
          template: { module: 'hbs!mapbuilder/core/view/toggle.html' }
        }
      }]
    }
  }
});
