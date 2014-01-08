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
      module: 'mapbuilder/core/model/mapobjecttoggle',
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
      module: 'mapbuilder/core/collection/mapobjecttogglecollection',
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
      module: 'mapbuilder/core/module/mapobjectmodule',
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
      module: 'mapbuilder/core/controller/mapobjectcollectioncontroller',
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
      module: 'mapbuilder/core/controller/togglecontrolscontroller',
      args: [
        {
          eventHub: { $ref: 'eventHub' },
          name: 'layers',
          collection: { $ref: 'layerStateCollection' },
          className: 'aeris-map-controls',
          itemViewOptions: {
            template: { module: 'hbars!mapbuilder/core/view/toggle.html' }
          },
          handlebarsHelpers: {
            i18n: { module: 'application/templatehelpers/i18n' }
          }
        }
      ]
    }
  },

  $plugins: [
    { module: 'application/plugin/classfactory' }
  ]
});
