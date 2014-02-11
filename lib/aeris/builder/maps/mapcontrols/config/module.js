define(
  /**
   * WireJS spec for the {aeris.builder.maps.mapcontrols.modules.MapControlsModule}
   * module.
   *
   * @class context
   * @namespace aeris.builder.maps.mapcontrols.config
   */
  {
    $exports: { $ref: 'mapControlsModule' },

    mapControlsModule: {
      create: {
        module: 'ai/builder/maps/mapcontrols/modules/mapcontrolsmodule',
        args: [{
          controlsController: { $ref: 'mapControlsController' },

          controlsRegion: {
            $ref: 'region!mapControls',
            layout: { $ref: 'mapAppLayout' }
          }
        }]
      }
    },

    mapControlsController: {
      create: {
        module: 'ai/builder/maps/mapcontrols/controllers/mapcontrolscontroller',
        args: [{
          eventHub: { $ref: 'eventHub' },
          builderOptions: { $ref: 'builderOptions' },
          className: 'sideMenu',
          selectedClass: 'state-open',
          deselectedClass: 'state-closed',

          template: { $ref: 'mapControlsTemplate' },

          ui: {
            mapOptionsToggle: '.mapControls>h1:first-child',
            mapOptionsContent: '.mapControls'
          },

          regions: { $ref: 'mapControlsRegions' },
          controlsRegionLookup: { $ref: 'controlsRegionLookup' }
        }]
      }
    },

    mapControlsTemplate: { module: 'hbars!ai/builder/maps/mapcontrols/views/controls.html' },

    mapControlsRegions: { wire: 'ai/builder/maps/mapcontrols/config/regions' },

    // These should match up to the
    // the keys of the "controls" builder options.
    controlsRegionLookup: {
      geolocation: 'geolocateControlsRegion',
      geocode: 'geocodeControlsRegion',
      layers: 'layerControlsRegion',
      markers: 'markerControlsRegion'
    },


    $plugins: [
      { module: 'ai/application/plugin/regionresolver' }
    ]
  }
);