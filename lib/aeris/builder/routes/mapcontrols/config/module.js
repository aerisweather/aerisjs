define({
  $exports: { $ref: 'mapControlsModule' },

  mapControlsModule: {
    wire: {
      spec: 'ai/builder/maps/mapcontrols/config/module',
      provide: {
        mapControlsRegions: { wire: 'ai/builder/routes/mapcontrols/config/regions' },

        controlsRegionLookup: {
          geolocation: 'geolocateControlsRegion',
          geocode: 'geocodeControlsRegion',
          layers: 'layerControlsRegion',
          markers: 'markerControlsRegion',
          routeBuilder: 'routeBuilderControlsRegion'
        },

        mapControlsTemplate: { module: 'hbars!ai/builder/routes/mapcontrols/views/controls.html' }
      }
    }
  }
});
