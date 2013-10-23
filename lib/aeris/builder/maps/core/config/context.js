/**
 * Context for the Core module.
 *
 * @property aeris.builder.maps.core.config.context
 * @type {Object}
 */
define({
  appState: {
    create: {
      module: 'mapbuilder/core/model/state'
    }
  },
  appRouter: {
    create: {
      module: 'mapbuilder/core/router/staterouter',
      args: [{
        state: { $ref: 'appState' }
      }]
    }
  }
});
