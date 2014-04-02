define({
  $exports: { $ref: 'mapControlsModule' },

  mapControlsModule: {
    wire: {
      spec: 'aeris/builder/maps/mapcontrols/config/module',
      provide: {
        mapControlsRegions: { wire: 'aeris/builder/routes/mapcontrols/config/regions' },

        controlsRegionLookup: {
          geolocation: 'geolocateControlsRegion',
          geocode: 'geocodeControlsRegion',
          layers: 'layerControlsRegion',
          markers: 'markerControlsRegion',
          routeBuilder: 'routeBuilderControlsRegion'
        },

        mapControlsTemplate: { module: 'hbars!aeris/builder/routes/mapcontrols/views/controls.html' }
      }
    }
  }
});
