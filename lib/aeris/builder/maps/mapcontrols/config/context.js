define(
  /**
   * WireJS spec for the {aeris.builder.maps.mapcontrols.module.MapControlsModule}
   * module.
   *
   * @class aeris.builder.maps.mapcontrols.config.context
   */
  {
    mapControlsModule: {
      create: {
        module: 'mapbuilder/mapcontrols/module/mapcontrolsmodule',
        args: [{
          controlsController: { $ref: 'mapControlsController' },

          controlsRegion: {
            $ref: 'region!mapControls',
            layout: { $ref: 'mapAppLayout' }
          }
        }]
      }
    },

    mapControlsController: {
      create: {
        module: 'mapbuilder/mapcontrols/controller/controlscontroller',
        args: [{
          eventHub: { $ref: 'eventHub' },
          builderOptions: { $ref: 'builderOptions' },
          className: 'sideMenu'
        }]
      }
    }
  }
);