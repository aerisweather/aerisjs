/**
 * Context for the Core module.
 *
 * @property aeris.builder.maps.core.config.context
 * @type {Object}
 */
define({
  appState: {
    create: 'mapbuilder/core/model/state'
  },
  eventHub: {
    create: 'aeris/events'
  },
  appRouter: {/*
    create: {
      module: 'mapbuilder/core/router/staterouter',
      args: [{
        state: { $ref: 'appState' }
      }]
    }*/
  }
});
