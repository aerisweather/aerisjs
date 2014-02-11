/**
 * Context for the Layers module
 *
 * @property aeris.builder.maps.layers.config.context
 * @type {Object}
 */
define({
  $exports: { $ref: 'layersModule' },

  LayerState: {
    ClassFactory: {
      module: 'ai/builder/maps/core/models/mapobjecttoggle',
      args: [
        undefined,
        {
          namespace: 'aeris.maps.layers'
        }
      ]
    }
  },

  layerStateCollection: {
    create: {
      module: 'ai/builder/maps/core/collections/mapobjecttogglecollection',
      args: [
        undefined,
        {
          // use the LayerState model
          model: {$ref: 'LayerState' }
        }
      ]
    }
  },

  layersModule: {
    create: {
      module: 'ai/builder/maps/core/modules/mapobjectmodule',
      args: [
        {
          appState: { $ref: 'appState' },
          appStateAttr: 'layers',
          moduleState: { $ref: 'layerStateCollection' },

          mapObjectController: { $ref: 'layerViewController' },
          controlsController: { $ref: 'layerControlsController' }
        }
      ]
    }
  },

  // Controller for Layer MapExtObjs
  layerViewController: {
    create: {
      module: 'ai/builder/maps/core/controllers/mapobjectcollectioncontroller',
      args: [
        {
          collection: { $ref: 'layerStateCollection' },
          itemViewOptions: {
            appState: { $ref: 'appState' }
          }
        }
      ]
    }
  },

  layerControlsController: {
    create: {
      module: 'ai/builder/maps/core/controllers/togglecontrolscontroller',
      args: [
        {
          eventHub: { $ref: 'eventHub' },
          name: 'layers',
          collection: { $ref: 'layerStateCollection' },
          className: 'aeris-map-controls',
          itemViewOptions: {
            template: { module: 'hbars!ai/builder/maps/core/views/toggle.html' }
          },
          handlebarsHelpers: {
            i18n: { module: 'ai/application/templatehelpers/i18n' }
          }
        }
      ]
    }
  },

  $plugins: [
    { module: 'ai/application/plugins/classfactory' }
  ]
});
