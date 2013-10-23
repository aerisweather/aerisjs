define([
  'aeris/util',
  'mapbuilder/mapappbuilder'
], function(_, MapAppBuilder) {
  /**
   *
   * @class aeris.builder.polaris.PolarisAppBuilder
   * @extends aeris.builder.maps.MapAppBuilder
   *
   * @constructor
   * @override
   */
  var PolarisAppBuilder = function(opt_options, opt_optionsClass) {
    MapAppBuilder.call(this, opt_options, opt_optionsClass);
  };
  _.inherits(PolarisAppBuilder, MapAppBuilder);


  return PolarisAppBuilder;
});
