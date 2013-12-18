define({
  routePointInfoModule: {
    create: {
      module: 'routeappbuilder/routebuilder/routepointinfo/module/routepointinfomodule',
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
      module: 'routeappbuilder/routebuilder/routepointinfo/controller/infopanelcontroller',
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
    module: 'hbs!routeappbuilder/routebuilder/routepointinfo/view/routepointinfopanel.html'
  },

  InfoPanelViewModel: {
    module: 'routeappbuilder/routebuilder/routepointinfo/viewmodel/infopanelviewmodel'
  }
});
