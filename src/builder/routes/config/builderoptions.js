define({
  $exports: { $ref: 'defaultBuilderOptions' },

  defaultBuilderOptions: {
    mapOptions: {
      zoom: 12,
      center: [44.98, -93.2636],
      scrollZoom: true
    },
    route: {
      path: {
        strokeColor: '#36648b',
        strokeOpacity: 0.8,
        strokeWeight: 3
      },
      offPath: {
        strokeColor: '#dd0000'
      },
      waypoint: {
        url: { $ref: 'assetPath!marker_grey.png' },
        width: 20,
        height: 20,
        clickable: true,
        draggable: true
      },
      selectedWaypoint: {
        url: { $ref: 'assetPath!marker_yellow.png' }
      }
    },
    routeControls: {
      undo: true,
      travelModes: [
        { $ref: 'travelMode!WALKING' },
        { $ref: 'travelMode!DRIVING' },
        { $ref: 'travelMode!BICYCLING' }
      ],
      startingPoint: true,
      distance: true,
      metric: false
    },
    controls: {
      layers: false,
      markers: false,
      routeBuilder: true
    }
  },

  $plugins: [
    { module: 'aeris/builder/routes/plugins/travelmode' },
    { module: 'aeris/application/plugins/assetpath'}
  ]
});
