define({
  $exports: { $ref: 'routePointInfoModule' },

  routePointInfoModule: {
    create: {
      module: 'routeappbuilder/routebuilder/routepointinfo/module/routepointinfomodule',
      args: [
        {
          eventHub: { $ref: 'eventHub' },
          InfoPanelController: { $ref: 'RoutePointInfoPanelController' },
          routeBuilder: { $ref: 'routeBuilder' }
        }
      ]
    }
  },

  RoutePointInfoPanelController: {
    ClassFactory: {
      module: 'routeappbuilder/routebuilder/routepointinfo/controller/infopanelcontroller',
      args: [
        {
          InfoPanelViewModel: { $ref: 'InfoPanelViewModel' },
          routeBuilder: { $ref: 'routeBuilder' },
          template: { $ref: 'routePointInfoTemplate' },
          ui: {
            deleteBtn: '.deleteBtn',
            closeBtn: 'h1',
            transitionTarget: 'header, section'
          }
        }
      ]
    }
  },

  routePointInfoTemplate: {
    module: 'hbars!routeappbuilder/routebuilder/routepointinfo/view/routepointinfopanel.html'
  },

  InfoPanelViewModel: {
    module: 'routeappbuilder/routebuilder/routepointinfo/viewmodel/infopanelviewmodel'
  },

  $plugins: [
    { module: 'application/plugin/classfactory' }
  ]
});
