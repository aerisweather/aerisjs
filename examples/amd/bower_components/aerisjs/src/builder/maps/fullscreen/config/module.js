define({
  $exports: { $ref: 'fullscreenModule' },

  fullscreenModule: {
    create: {
      module: 'aeris/builder/maps/fullscreen/modules/fullscreenmodule',
      args: [{
        fullscreenController: { $ref: 'fullscreenController' },
        fullscreenBtnController: { $ref: 'fullscreenBtnController' },
        eventHub: { $ref: 'eventHub' }
      }]
    }
  },

  fullscreenController: {
    create: {
      module: 'aeris/builder/maps/fullscreen/controllers/fullscreencontroller',
      args: [{
        fullscreenService: { $ref: 'fullscreenService' }
      }]
    },
    listenTo: {
      eventHub: {
        'fullscreen:request': 'enterFullscreen',
        'exitFullscreen:request': 'exitFullscreen'
      }
    }
  },

  fullscreenBtnController: {
    create: {
      module: 'aeris/builder/maps/fullscreen/controllers/fullscreenbtncontroller',
      args: [{
        tagName: 'a',
        eventHub: { $ref: 'eventHub' },
        fullscreenStyle: { wire: 'aeris/builder/maps/fullscreen/config/fullscreenstyle' },
        template: { $ref: 'fullscreenBtnTemplate' },
        fullscreenClass: { $ref: 'fullscreenBtnClasses.fullscreen' },
        exitFullscreenClass: { $ref: 'fullscreenBtnClasses.exitFullscreen' },
        fullscreenService: { $ref: 'fullscreenService' }
      }]
    }
  },

  // FullscreenBtnController configuration options
  fullscreenBtnTemplate: { module: 'hbars!aeris/builder/maps/fullscreen/view/fullscreenbutton.html' },
  fullscreenBtnClasses: {
    fullscreen: 'aeris-fullscreen',
    exitFullscreen: 'aeris-exitFullscreen'
  },

  fullscreenService: {
    create: 'aeris/builder/maps/fullscreen/helpers/fullscreenservice'
  },

  $plugins: [
    { module: 'aeris/application/plugins/events' }
  ]
});
