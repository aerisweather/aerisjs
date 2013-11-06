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
          moduleController: { $ref: 'markerLayout' },

          appState: { $ref: 'appState' },
          appStateAttr: 'markers',
          moduleState: { $ref: 'markerStateCollection' },

          mapObjectController: { $ref: 'markerViewController' },

          validFilters: { module: 'mapbuilder/markers/config/validmarkerfilters' }
        }]
      },
      init: {
        setRegion: [ 'markerControls', { $ref: 'mapAppLayout' } ]
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

    markerControlsController: {
      create: {
        module: 'application/form/controller/togglecollectioncontroller',
        args: [{
          className: 'aeris-map-controls',
          collection: { $ref: 'markerStateCollection' },
          itemView: { module: 'mapbuilder/markers/controller/markertogglecontroller' },
          itemViewOptions: {
            className: 'aeris-markerTypeControls'
          }
        }]
      }
    },

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
