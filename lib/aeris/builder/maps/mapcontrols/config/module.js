define(
  /**
   * WireJS spec for the {aeris.builder.maps.mapcontrols.module.MapControlsModule}
   * module.
   *
   * @class aeris.builder.maps.mapcontrols.config.context
   */
  {
    $exports: { $ref: 'mapControlsModule' },

    mapControlsModule: {
      create: {
        module: 'mapbuilder/mapcontrols/module/mapcontrolsmodule',
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
        module: 'mapbuilder/mapcontrols/controller/mapcontrolscontroller',
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

    mapControlsTemplate: { module: 'hbars!mapbuilder/mapcontrols/view/controls.html' },

    mapControlsRegions: { wire: 'mapbuilder/mapcontrols/config/regions' },

    // These should match up to the
    // the keys of the "controls" builder options.
    controlsRegionLookup: {
      geolocation: 'geolocateControlsRegion',
      geocode: 'geocodeControlsRegion',
      layers: 'layerControlsRegion',
      markers: 'markerControlsRegion'
    },


    $plugins: [
      { module: 'application/plugin/regionresolver' }
    ]
  }
);