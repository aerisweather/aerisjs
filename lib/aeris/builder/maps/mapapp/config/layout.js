define({
  $exports: { $ref: 'mapAppLayout' },

  mapAppTemplate: {
    module: 'text!mapbuilder/mapapp/view/app.html'
  },

  mapAppRegions: {
    mapCanvas: '.mapCanvasRegion',
    mapControls: '.mapControlsRegion',
    infoPanel: '.infoPanelRegion',
    modal: '.aeris-modalViewRegion'
  },

  mapAppLayout: {
    create: {
      module: 'application/controller/layoutcontroller',
      args: [
        {
          template: { $ref: 'mapAppTemplate' },
          className: 'aeris-maps-app'
        }
      ]
    },
    init: {
      // Think of this as setter-injection
      addRegions: [
        { $ref: 'mapAppRegions' }
      ],

      // Render our layout right away
      render: []
    }
  }
})