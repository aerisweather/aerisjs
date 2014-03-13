define({
  $exports: { $ref: 'routeBuilder' },

  routeBuilder: {
    create: {
      module: 'aeris/maps/routes/routebuilder',
      args: [
        {
          travelMode: { $ref: 'routeBuilderOptions.travelMode' },
          followDirections: { $ref: 'routeBuilderOptions.followDirections' },
          styles: { $ref: 'routeBuilderOptions.styles' },

          routeRenderer: { $ref: 'routeRenderer' },
          route: { $ref: 'route' }
        }
      ]
    }
  },

  routeBuilderOptions: {
    travelMode: { $ref: 'travelMode!DRIVING' },
    followDirections: true,
    styles: {}
  },

  routeRenderer: {
    create: {
      module: 'aeris/maps/routes/routerenderer',
      args: [
        {
          offPath: {
            strokeColor: '#c70402',
            strokeWeight: 5,
            strokeOpacity: 0.9
          },
          waypoint: {
            url: { $ref: 'assetPath!marker_grey.png' },
            offsetX: 12,
            offsetY: 36
          },
          selectedWaypoint: {
            url: { $ref: 'assetPath!marker_green.png' },
            offsetX: 25,
            offsetY: 36
          }
        }
      ]
    }
  },

  route: {
    create: 'aeris/maps/routes/route'
  },


  $plugins: [
    { module: 'aeris/builder/routes/plugins/travelmode' },
    { module: 'aeris/application/plugins/assetpath' }
  ]
});
