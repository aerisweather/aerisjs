aeris.MapBuilder = function(buildConfig) {
  require.config({
    config: {
      'aeris/config': {
        assetPath: buildConfig.assetPath,
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
      // Call noConflict on AMD modules
      require('backbone').noConflict();

      new Builder(buildConfig).build();
    });
  });
};


// Call noConflict on non-AMD modules
// because they are immediately loaded in build.
// AMD vendor modules have not yet been loaded
jQuery.noConflict(true);
_.noConflict();
