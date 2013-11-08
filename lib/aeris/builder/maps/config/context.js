define([
  'aeris/util',
  'mapbuilder/core/config/context',
  'mapbuilder/mapapp/config/context',
  'mapbuilder/mapcontrols/config/context',
  'mapbuilder/map/config/context',
  'mapbuilder/markers/config/context',
  'mapbuilder/layers/config/context'
], function(_, coreContext, mapAppContext, mapControlsContext, mapContext, markersContext, layersContext) {
  /**
   * Combines all module contexts into a single context
   * for the mapappbuilder to wire.
   *
   * @class aeris.builder.maps.config.context
   */
  return _.extend({
      builderOptions: {
        create: {
          module: 'mapbuilder/options/mapappbuilderoptions',
          args: [
            null,
            {
              defaults: {
                mapOptions: {
                  zoom: 12,
                  center: [44.98, -93.2636],
                  scrollZoom: true
                },
                layers: [],
                markers: [],
                poi: [],
                controls: {
                  layers: false,
                  poi: false
                }
              },
              mapObjectTypes: ['layers', 'markers']
            }
          ]
        }
      },

      $plugins: [
        'application/plugin/regionresolver'
      ]
    },
    coreContext, mapAppContext, mapControlsContext, mapContext, markersContext, layersContext);
});
