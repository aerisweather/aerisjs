  // An exposed wrapper around the Builder
  // Which provides immediate access to the client.
  // Saves client-provided config object, and passes
  // to the 'real' Builder class.
  // Work-around for asynchronous ReqJS loading.

  // To make this work for mutliple builders,
  // we'll probably want a build script that
  // writes this out with a dynamically-name
  // builder.
  aeris.RiderX = function(buildConfig) {
    require([
      'polaris/routeplanner/routeplannerbuilder'
    ], function(RiderXBuilder) {
      var builder = new RiderXBuilder(buildConfig);
      builder.build();
    })
  };
})(this);
