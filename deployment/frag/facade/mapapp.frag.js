aeris.MapBuilder = function(buildConfig) {
  require.config({
    config: {
      'ai/config': {
        path: buildConfig.path,
        apiId: buildConfig.apiId,
        apiSecret: buildConfig.apiSecret
      },

      'ai/geocode/config': {
        apiId: buildConfig.mapquest.apiKey
      }
    },

    googlemaps: {
      params: {
        libraries: 'geometry',
        key: buildConfig.google.apiKey
      }
    }
  });
  require(['ai/builder/maps/mapappbuilder'], function(Builder) {
    new Builder(buildConfig).build();
  });
};