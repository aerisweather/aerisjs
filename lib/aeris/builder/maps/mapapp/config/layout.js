define({
  $exports: { $ref: 'mapAppLayout' },

  mapAppTemplate: {
    module: 'text!ai/builder/maps/mapapp/view/app.html'
  },

  mapAppRegions: {
    mapCanvas: '.mapCanvasRegion',
    mapControls: '.mapControlsRegion',
    infoPanel: '.infoPanelRegion',
    modal: '.aeris-modalViewRegion'
  },

  mapAppLayout: {
    create: {
      module: 'ai/application/controller/layoutcontroller',
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