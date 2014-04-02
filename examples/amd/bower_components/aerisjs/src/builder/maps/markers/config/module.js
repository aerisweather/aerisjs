/**
 * Context for the Markers module
 *
 * @class context
 * @namespace aeris.builder.maps.markers.config
 * @static
 */
define({
  $exports: { $ref: 'markersModule' },

  markerStateCollection: {
    create: {
      module: 'aeris/builder/maps/core/collections/mapobjecttogglecollection',
      args: [undefined, {
        // Use MarkerToggle model with our state collection.
        model: { module: 'aeris/builder/maps/markers/models/markertoggle' }
      }]
    }
  },

  markersModule: {
    create: {
      module: 'aeris/builder/maps/markers/modules/markersmodule',
      args: [
        {
          appState: { $ref: 'appState' },
          appStateAttr: 'markers',
          moduleState: { $ref: 'markerStateCollection' },
          eventHub: { $ref: 'eventHub' },

          mapObjectController: { $ref: 'markerViewController' },
          controlsController: { $ref: 'markerControlsController' },

          validFilters: { module: 'aeris/builder/maps/markers/config/validmarkerfilters' },

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
      module: 'aeris/builder/maps/core/controllers/mapobjectcollectioncontroller',
      args: [
        {
          collection: { $ref: 'markerStateCollection' },
          itemView: { module: 'aeris/builder/maps/markers/controllers/markercontroller' },
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
      module: 'aeris/builder/maps/core/controllers/togglecontrolscontroller',
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
      module: 'aeris/builder/maps/markers/controllers/markermenucontroller',
      args: [
        {
          template: { module: 'hbars!aeris/builder/maps/markers/views/markermenuitem.html' },
          handlebarsHelpers: {
            i18n: { module: 'aeris/application/templatehelpers/i18n' }
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
      module: 'aeris/builder/maps/markers/controllers/filtertogglescontroller',
      args: [
        {
          className: 'aeris-subMenu',

          itemViewOptions: {
            template: { module: 'hbars!aeris/builder/maps/core/views/toggle.html' },
            handlebarsHelpers: {
              i18n: { module: 'aeris/application/templatehelpers/i18n' }
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
      module: 'aeris/builder/maps/markers/controllers/markerinfocontroller',
      args: [
        {
          template: { module: 'hbars!aeris/builder/maps/markers/views/markerdetails.html' }
        }
      ]
    }
  },

  eventDataTransformer: { module: 'aeris/builder/maps/transformers/eventdatatransformer' },

  $plugins: [
    { module: 'aeris/application/plugins/events' },
    { module: 'aeris/application/plugins/classfactory' }
  ]
});
