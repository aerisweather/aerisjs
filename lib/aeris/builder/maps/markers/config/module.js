/**
 * Context for the Markers module
 *
 * @class aeris.builder.maps.markers.config.context
 * @static
 */
define({
  $exports: { $ref: 'markersModule' },

  markerStateCollection: {
    create: {
      module: 'ai/builder/maps/core/collection/mapobjecttogglecollection',
      args: [undefined, {
        // Use MarkerToggle model with our state collection.
        model: { module: 'ai/builder/maps/markers/model/markertoggle' }
      }]
    }
  },

  markersModule: {
    create: {
      module: 'ai/builder/maps/markers/module/markersmodule',
      args: [
        {
          appState: { $ref: 'appState' },
          appStateAttr: 'markers',
          moduleState: { $ref: 'markerStateCollection' },
          eventHub: { $ref: 'eventHub' },

          mapObjectController: { $ref: 'markerViewController' },
          controlsController: { $ref: 'markerControlsController' },

          validFilters: { module: 'ai/builder/maps/markers/config/validmarkerfilters' },

          // Constructor for MarkerInfoController
          // (marker details view)
          MarkerInfoController: { $ref: 'MarkerInfoController' }
        }
      ]
    },
    listenTo: {
      eventHub: {
        'marker:click': 'eventDataTransformer.markerClick | renderMarkerInfo'
      }
    }
  },

  markerViewController: {
    create: {
      module: 'ai/builder/maps/core/controller/mapobjectcollectioncontroller',
      args: [
        {
          collection: { $ref: 'markerStateCollection' },
          itemView: { module: 'ai/builder/maps/markers/controller/markercontroller' },
          itemViewOptions: {
            appState: { $ref: 'appState' },
            eventHub: { $ref: 'eventHub' }
          }
        }
      ]
    }
  },

  // Represents map controls
  // for all types of Marker objects
  markerControlsController: {
    create: {
      module: 'ai/builder/maps/core/controller/togglecontrolscontroller',
      args: [
        {
          eventHub: { $ref: 'eventHub' },
          name: 'markers',
          collection: { $ref: 'markerStateCollection' },
          itemView: { $ref: 'MarkerMenuController' }
        }
      ]
    }
  },

  // Map controls for a single marker object type
  // (where the menu sub-items are filter toggles)
  MarkerMenuController: {
    ClassFactory: {
      module: 'ai/builder/maps/markers/controller/markermenucontroller',
      args: [
        {
          template: { module: 'hbars!ai/builder/maps/markers/view/markermenuitem.html' },
          handlebarsHelpers: {
            i18n: { module: 'ai/application/templatehelpers/i18n' }
          },
          className: 'aeris-navItem',

          ui: {
            navBtn: '.aeris-navItemLabel'
          },

          regions: {
            filters: '.aeris-markerFilterSelect'
          },

          FilterTogglesController: { $ref: 'FilterTogglesController' }
        }
      ]
    }
  },

  // A set of filter toggle controls
  FilterTogglesController: {
    ClassFactory: {
      module: 'ai/builder/maps/markers/controller/filtertogglescontroller',
      args: [
        {
          className: 'aeris-subMenu',

          itemViewOptions: {
            template: { module: 'hbars!ai/builder/maps/core/view/toggle.html' },
            handlebarsHelpers: {
              i18n: { module: 'ai/application/templatehelpers/i18n' }
            },
            className: 'aeris-subMenuItem',
            selectedClass: 'aeris-selected',
            deselectedClass: 'aeris-deselected'
          }
        }
      ]
    }
  },


  MarkerInfoController: {
    ClassFactory: {
      module: 'ai/builder/maps/markers/controller/markerinfocontroller',
      args: [
        {
          template: { module: 'hbars!ai/builder/maps/markers/view/markerdetails.html' }
        }
      ]
    }
  },

  eventDataTransformer: { module: 'ai/builder/maps/transformer/eventdatatransformer' },

  $plugins: [
    { module: 'ai/application/plugin/events' },
    { module: 'ai/application/plugin/classfactory' }
  ]
});
