define([
  'aeris/util',
  'mapbuilder/mapappbuilder',
  'aeris/builder/route/options/routebuilderoptions',
  'aeris/builder/route/controller/appcontroller'
], function(
  _,
  MapAppBuilder,
  BuilderOptions,
  AppController
) {

  /**
   * @constructor
   * @class aeris.builder.RouteAppBuilder
   * @extends aeris.builder.maps.MapAppBuilder
   */
  var RouteAppBuilder = function(opt_options, opt_optionsClass) {
    var optionsClass = opt_optionsClass || BuilderOptions;
    MapAppBuilder.call(this, opt_options, optionsClass);
  };
  _.inherits(RouteAppBuilder, MapAppBuilder);


  /**
   * @override
   */
  RouteAppBuilder.prototype.build = function() {
    var appOptions = {
      mapOptions: this.getOption('map'),
      routeOptions: this.getOption('route'),
      controlsOptions: this.getOption('routeControls')
    };

    this.render_(new AppController(appOptions));
  };


  return _.expose(RouteAppBuilder, 'aeris.RouteAppBuilder');
});
