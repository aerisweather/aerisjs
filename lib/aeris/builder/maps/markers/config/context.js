/**
 * Context for the Markers module
 *
 * @class aeris.builder.maps.markers.config.context
 * @static
 */
define([
  'aeris/util'
], function() {
  return {
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
        module: 'mapbuilder/markers/module/markersmodule',
        args: [{
          appState: { $ref: 'appState' },
          appStateAttr: 'markers',
          moduleState: { $ref: 'markerStateCollection' },

          mapObjectController: { $ref: 'markerViewController' },
          controlsController: { $ref: 'markerControlsController' },

          validFilters: { module: 'mapbuilder/markers/config/validmarkerfilters' }
        }]
      }
    },

    markerViewController: {
      create: {
        module: 'mapbuilder/core/controller/mapobjectcollectioncontroller',
        args: [{
          collection: { $ref: 'markerStateCollection' },
          itemView: { module: 'mapbuilder/markers/controller/markercontroller' },
          itemViewOptions: {
            appState: { $ref: 'appState' },
            eventHub: { $ref: 'eventHub' }
          }
        }]
      }
    },

    markerLayout: {
      create: {
        module: 'mapbuilder/markers/controller/markerlayout',
        args: [{
          template: { module: 'hbs!mapbuilder/markers/view/markerlayout.html' },
          regions: {
            markerControls: '.aeris-markerControls',
            markerDetails: '.aeris-markerDetails'
          },
          regionControllers: {
            markerControls: { $ref: 'markerControlsController' }
          },

          // Constructor for MarkerDataController
          // (marker details view)
          MarkerDataController: { $ref: 'MarkerDataController' },

          eventHub: { $ref: 'eventHub' }
        }]
      }
    },

    // Represents map controls
    // for all types of Marker objects
    markerControlsController: {
      create: {
        module: 'mapbuilder/core/controller/togglecontrolscontroller',
        args: [{
          eventHub: { $ref: 'eventHub' },
          name: 'markers',
          collection: { $ref: 'markerStateCollection' },
          itemView: { $ref: 'MarkerMenuController' }
        }]
      }
    },

    // Map controls for a single marker object type
    // (where the menu sub-items are filter toggles)
    MarkerMenuController: _.classFactorySpec({
      create: {
        module: 'mapbuilder/markers/controller/markermenucontroller',
        args: [{
          template: { module: 'hbs!mapbuilder/markers/view/markermenuitem.html' },
          className: 'aeris-navItem',

          ui: {
            navBtn: '.aeris-navItemLabel'
          },

          regions: {
            filters: '.aeris-markerFilterSelect'
          },

          FilterTogglesController: { $ref: 'FilterTogglesController' }
        }]
      }
    }),

    // A set of filter toggle controls
    FilterTogglesController: _.classFactorySpec({
      create: {
        module: 'mapbuilder/markers/controller/filtertogglescontroller',
        args: [{
          className: '.aeris-subMenuItem'
        }]
      }
    }),


    MarkerDataController: _.classFactorySpec({
      create: {
        module: 'mapbuilder/markers/controller/markerdatacontroller',
        args: [{
          template: { module: 'hbs!mapbuilder/markers/view/markerdetails.html' },
          events: {
            'click .aeris-closeBtn': 'close'
          }
        }]
      }
    })
  };

});
