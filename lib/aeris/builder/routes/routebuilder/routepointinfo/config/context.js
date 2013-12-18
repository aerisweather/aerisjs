define({
  routePointInfoModule: {
    create: {
      module: 'routebuilder/routebuilder/routepointinfo/module/routepointinfomodule',
      args: [{
        eventHub: { $ref: 'eventHub' },
        infoPanelController: { $ref: 'routePointInfoPanelController' },
        InfoPanelViewModel: { $ref: 'InfoPanelViewModel' },
        routeBuilder: { $ref: 'routeBuilder' }
      }]
    }
  },

  routePointInfoPanelController: {
    create: {
      module: 'routebuilder/routebuilder/routepointinfo/controller/infopanelcontroller',
      args: [{
        routeBuilder: { $ref: 'routeBuilder' },
        template: { $ref: 'routePointInfoTemplate' },
        ui: {
          deleteBtn: '.deleteBtn'
        }
      }]
    }
  },

  routePointInfoTemplate: {
    module: 'hbs!routebuilder/routebuilder/routepointinfo/view/routepointinfopanel.html'
  },

  InfoPanelViewModel: {
    module: 'routebuilder/routebuilder/routepointinfo/viewmodel/infopanelviewmodel'
  }
});
