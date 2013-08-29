define([
  'aeris/util',
  'aeris/builder/appbuilder',
  'aeris/builder/maps/controller/appcontroller',
  'aeris/builder/maps/options/mapappbuilderoptions',
  'aeris/errors/invalidargumenterror'
], function(
  _,
  BaseAppBuilder,
  AppController,
  AppBuilderOptions,
  InvalidArgumentError
) {
  /**
   * @constructor
   * @class aeris.builder.maps.MapAppBuilder
   * @extends aeris.builder.AppBuilder
   */
  var MapAppBuilder = function(opt_options, opt_optionsClass) {
    var optionsClass = opt_optionsClass || AppBuilderOptions;
    BaseAppBuilder.call(this, opt_options, optionsClass);

    if (!this.getOption('el')) {
      throw new InvalidArgumentError('MapAppBuilder requires an \'el\' option');
    }
  };
  _.inherits(MapAppBuilder, BaseAppBuilder);


  /**
   * @override
   */
  MapAppBuilder.prototype.build = function() {
    var appOptions = {
      map: this.getOption('map'),
      layers: this.getOption('layers'),
      controls: this.getOption('controls')
    };

    this.render_(new AppController(appOptions));
  };

  /**
   * Render a Controller
   * @param {aeris.Controller} controller
   * @protected
   */
  MapAppBuilder.prototype.render_ = function(controller) {
    var el = this.getOption('el');
    el.innerHTML = '';

    controller.render().$el.appendTo(el);
  };


  return _.expose(MapAppBuilder, 'aeris.MapAppBuilder');
});
