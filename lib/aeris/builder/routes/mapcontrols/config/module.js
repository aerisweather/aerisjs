define({
  $exports: { $ref: 'mapControlsModule' },

  mapControlsModule: {
    wire: {
      spec: 'mapbuilder/mapcontrols/config/module',
      provide: {
        mapControlsRegions: { wire: 'routeappbuilder/mapcontrols/config/regions' },

        controlsRegionLookup: {
          geolocation: 'geolocateControlsRegion',
          geocode: 'geocodeControlsRegion',
          layers: 'layerControlsRegion',
          markers: 'markerControlsRegion',
          routeBuilder: 'routeBuilderControlsRegion'
        },

        mapControlsTemplate: { module: 'hbars!routeappbuilder/mapcontrols/view/controls.html' }
      }
    }
  }
});
