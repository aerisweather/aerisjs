  // An exposed wrapper around the Builder
  // Which provides immediate access to the client.
  // Saves client-provided config object, and passes
  // to the 'real' Builder class.
  // Work-around for asynchronous ReqJS loading.

  // To make this work for mutliple builders,
  // we'll probably want a build script that
  // writes this out with a dynamically-name
  // builder.
  aeris.MapApp = function(buildConfig) {
    require([
      'mapbuilder/mapappbuilder'
    ], function(MapAppBuilder) {
      var builder = new MapAppBuilder(buildConfig);
      builder.build();
    })
  };
})(this);
