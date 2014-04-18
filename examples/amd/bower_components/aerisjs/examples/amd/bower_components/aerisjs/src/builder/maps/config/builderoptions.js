define({
  defaultBuilderOptions: {
    mapOptions: {
      zoom: 12,
      center: [44.98, -93.2636],
      scrollZoom: true
    },
    markers: [
      {
        type: 'EarthquakeMarkers',
        selected: true,
        filters: [
          'mini',
          'minor',
          'light',
          'moderate'
        ]
      },
      {
        type: 'StormReportMarkers',
        selected: true,
        filters: ['snow']
      }
    ],
    layers: [
      {
        type: 'Radar',
        selected: true
      },
      'Satellite',
      'Advisories',
      'HeatIndex',
      'Temps',
      'SnowDepth'
    ],
    controls: {
      layers: true,
      markers: true,
      geolocation: true,
      geocode: true
    }
  },

  $exports: { $ref: 'defaultBuilderOptions' }
});
