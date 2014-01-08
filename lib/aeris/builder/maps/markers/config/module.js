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
      module: 'mapbuilder/core/collection/mapobjecttogglecollection',
      args: [undefined, {
        // Use MarkerToggle model with our state collection.
        model: { module: 'mapbuilder/markers/model/markertoggle' }
      }]
    }
  },

  markersModule: {
    create: {
      module: 'mapbuilder/markers/module/markersmodule',
      args: [
        {
          appState: { $ref: 'appState' },
          appStateAttr: 'markers',
          moduleState: { $ref: 'markerStateCollection' },
          eventHub: { $ref: 'eventHub' },

          mapObjectController: { $ref: 'markerViewController' },
          controlsController: { $ref: 'markerControlsController' },

          validFilters: { module: 'mapbuilder/markers/config/validmarkerfilters' },

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
      module: 'mapbuilder/core/controller/mapobjectcollectioncontroller',
      args: [
        {
          collection: { $ref: 'markerStateCollection' },
          itemView: { module: 'mapbuilder/markers/controller/markercontroller' },
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
      module: 'mapbuilder/core/controller/togglecontrolscontroller',
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
      module: 'mapbuilder/markers/controller/markermenucontroller',
      args: [
        {
          template: { module: 'hbars!mapbuilder/markers/view/markermenuitem.html' },
          handlebarsHelpers: {
            i18n: { module: 'application/templatehelpers/i18n' }
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
      module: 'mapbuilder/markers/controller/filtertogglescontroller',
      args: [
        {
          className: 'aeris-subMenu',

          itemViewOptions: {
            template: { module: 'hbars!mapbuilder/core/view/toggle.html' },
            handlebarsHelpers: {
              i18n: { module: 'application/templatehelpers/i18n' }
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
      module: 'mapbuilder/markers/controller/markerinfocontroller',
      args: [
        {
          template: { module: 'hbars!mapbuilder/markers/view/markerdetails.html' }
        }
      ]
    }
  },

  eventDataTransformer: { module: 'mapbuilder/transformer/eventdatatransformer' },

  $plugins: [
    { module: 'application/plugin/events' },
    { module: 'application/plugin/classfactory' }
  ]
});
