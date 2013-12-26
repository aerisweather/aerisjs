define(
  /**
   * WireJS spec for the {aeris.builder.maps.mapcontrols.module.MapControlsModule}
   * module.
   *
   * @class aeris.builder.maps.mapcontrols.config.context
   */
  {
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
          controlsRegions: { $ref: 'mapControlsControllerRegions' }
        }]
      }
    },

    mapControlsTemplate: { module: 'hbars!mapbuilder/mapcontrols/view/controls.html' },

    mapControlsRegions: {
      geolocateControlsRegion: '.geolocateControls',
      geocodeControlsRegion: '.geocodeRegion',
      layerControlsRegion: '.layerControls',
      markerControlsRegion: '.markerControls'
    },

    // These should match up to the
    // the keys of the "controls" builder options.
    mapControlsControllerRegions: {
      geolocation: 'geolocateControlsRegion',
      geocode: 'geocodeControlsRegion',
      layers: 'layerControlsRegion',
      markers: 'markerControlsRegion'
    }
  }
);