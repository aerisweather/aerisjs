define([
  'aeris/util',
  'mapappbuilder/loader',
  'polaris,builder/polarisappbuilder'
], function(_, BaseLoader, PolarisAppBuilder) {
  /**
   * Loads the Polaris app builder.
   *
   * @class aeris.builder.polaris.Loader
   * @extends aeris.builder.maps.Loader
   *
   * @constructor
   */
  var PolarisAppLoader = function(opt_options) {
    var options = _.extend({
      builder: PolarisAppBuilder
    }, opt_options);

    BaseLoader.call(this, options);
  };
  _.inherits(PolarisAppLoader, BaseLoader);


  return PolarisAppLoader;
});
