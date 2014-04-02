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
        module: 'aeris/builder/maps/mapcontrols/modules/mapcontrolsmodule',
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
        module: 'aeris/builder/maps/mapcontrols/controllers/mapcontrolscontroller',
        args: [{
          eventHub: { $ref: 'eventHub' },
          builderOptions: { $ref: 'builderOptions' },
          className: 'aeris-sideMenu',
          selectedClass: 'aeris-state-open',
          deselectedClass: 'aeris-state-closed',

          template: { $ref: 'mapControlsTemplate' },

          ui: {
            mapOptionsToggle: '.aeris-mapControls>h1:first-child',
            mapOptionsContent: '.aeris-mapControls'
          },

          regions: { $ref: 'mapControlsRegions' },
          controlsRegionLookup: { $ref: 'controlsRegionLookup' }
        }]
      }
    },

    mapControlsTemplate: { module: 'hbars!aeris/builder/maps/mapcontrols/views/controls.html' },

    mapControlsRegions: { wire: 'aeris/builder/maps/mapcontrols/config/regions' },

    // These should match up to the
    // the keys of the "controls" builder options.
    controlsRegionLookup: {
      geolocation: 'geolocateControlsRegion',
      geocode: 'geocodeControlsRegion',
      layers: 'layerControlsRegion',
      markers: 'markerControlsRegion',
      fullscreen: 'fullscreenControlsRegion'
    },


    $plugins: [
      { module: 'aeris/application/plugins/regionresolver' }
    ]
  }
);
