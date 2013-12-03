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
        module: 'mapbuilder/mapcontrols/controller/controlscontroller',
        args: [{
          eventHub: { $ref: 'eventHub' },
          builderOptions: { $ref: 'builderOptions' },
          className: 'sideMenu',
          selectedClass: 'state-open',
          deselectedClass: 'state-closed',

          template: { module: 'hbs!mapbuilder/mapcontrols/view/controls.html' },

          ui: {
            mapOptionsToggle: '.mapControls>h1:first-child',
            mapOptionsContent: '.mapControls'
          },

          regions: {
            geolocateControlsRegion: '.geolocateControls',
            geocodeControlsRegion: '.geocodeRegion',
            layerControlsRegion: '.layerControls',
            markerControlsRegion: '.markerControls',
            waypointControlsRegion: '.waypointControls',
            routeBuilderControlsRegion: '.routeBuilderControls',
            publicTrailsControlsRegion: '.publicTrailsControlsRegion'
          },
          // These should match up to the
          // the keys of the "controls" builder options.
          controlsRegions: {
            layers: 'layerControlsRegion',
            markers: 'markerControlsRegion',
            waypoints: 'waypointControlsRegion',
            publicTrails: 'publicTrailsControlsRegion',
            geolocation: 'geolocateControlsRegion',
            geocode: 'geocodeControlsRegion',
            routeBuilder: 'routeBuilderControlsRegion'
          }
          /** TODO Polaris config and view template needs to be split out */
        }]
      }
    }
  }
);