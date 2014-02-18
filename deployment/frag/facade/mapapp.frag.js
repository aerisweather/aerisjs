aeris.MapBuilder = function(buildConfig) {
  require.config({
    config: {
      'aeris/config': {
        path: buildConfig.path,
        apiId: buildConfig.apiId,
        apiSecret: buildConfig.apiSecret
      }
    },

    googlemaps: {
      params: {
        libraries: 'geometry',
        key: buildConfig.google.apiKey
      }
    }
  });
  require([
    'aeris/packages/maps'
  ], function() {
    require(['aeris/builder/maps/mapappbuilder'], function(Builder) {
      new Builder(buildConfig).build();
    });
  });
};