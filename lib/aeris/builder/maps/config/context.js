define([
  'aeris/util',
  'mapbuilder/core/config/context',
  'mapbuilder/mapapp/config/context',
  'mapbuilder/mapcontrols/config/context',
  'mapbuilder/map/config/context',
  'mapbuilder/markers/config/context',
  'mapbuilder/layers/config/context',
  'mapbuilder/infopanel/config/context',
  'mapbuilder/modal/config/context',
  'mapbuilder/geosearch/config/context'
], function(_) {
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
                markers: [
                  {
                    type: 'EarthquakeMarkers',
                    selected: true,
                    filters: [
                      'mini',
                      'minor',
                      'light',
                      'moderate'
                    ]
                  },
                  {
                    type: 'StormReportMarkers',
                    selected: true,
                    filters: ['snow']
                  }
                ],
                layers: [
                  {
                    type: 'AerisRadar',
                    selected: true
                  },
                  'AerisSatellite',
                  'AerisAdvisories',
                  'AerisHeatIndex',
                  'AerisTemps',
                  'AerisSnowDepth'
                ],
                controls: {
                  layers: true,
                  markers: true,
                  geolocation: true,
                  geocode: true
                }
              },
              mapObjectTypes: ['layers', 'markers']
            }
          ]
        }
      },

      $plugins: [
        { module: 'application/plugin/regionresolver' },
        { module: 'application/plugin/events' }
      ]
    },

    // Extend spec with all component specs.
    // Using simplified require syntax here
    // so we don't have to keep track of so many
    // injected ReqJS params.
    require('mapbuilder/core/config/context'),
    require('mapbuilder/mapapp/config/context'),
    require('mapbuilder/mapcontrols/config/context'),
    require('mapbuilder/map/config/context'),
    require('mapbuilder/markers/config/context'),
    require('mapbuilder/layers/config/context'),
    require('mapbuilder/infopanel/config/context'),
    require('mapbuilder/modal/config/context'),
    require('mapbuilder/geosearch/config/context')
  );
});
