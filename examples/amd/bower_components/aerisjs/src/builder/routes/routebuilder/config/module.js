/**
 * WireJS Spec for Routes App RouteBuilder module
 * @class context
 * @namespace aeris.builder.routes.routebuilder.config
 * @static
 */
define({
  $exports: { $ref: 'routeBuilderModule' },

  routeBuilderModule: {
    create: {
      module: 'aeris/builder/routes/routebuilder/modules/routebuildermodule',
      args: [
        {
          routeControlsController: { $ref: 'controllers.routeControlsController' },
          routeBuilderController: { $ref: 'controllers.routeBuilderController' },
          eventHub: { $ref: 'eventHub' },
          appState: { $ref: 'appState' },
          modules: { wire: 'aeris/builder/routes/routebuilder/config/submodules' }
        }
      ]
    }
  },

  controllers: { wire: 'aeris/builder/routes/routebuilder/config/controllers' },

  routeBuilder: { wire: 'aeris/builder/routes/routebuilder/config/routebuilder' }

});
