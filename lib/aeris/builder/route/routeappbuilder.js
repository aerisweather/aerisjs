define([
  'aeris/util',
  'aeris/builder/appbuilder',
  'aeris/builder/route/options/routebuilderoptions',
  'aeris/builder/route/controller/appcontroller'
], function(
  _,
  BaseAppBuilder,
  BuilderOptions,
  AppController
) {
  _.provide('aeris.RouteAppBuilder');

  /**
   * @constructor
   * @class
   * @extends {BaseAppBuilder}
   */
  aeris.RouteAppBuilder = function(opt_options, opt_optionsClass) {
    var optionsClass = opt_optionsClass || BuilderOptions;
    BaseAppBuilder.call(this, opt_options, optionsClass);
  };
  _.inherits(aeris.RouteAppBuilder, BaseAppBuilder);

  aeris.RouteAppBuilder.prototype.build = function() {
    var appOptions = {
      mapOptions: this.getOption('map'),
      routeOptions: this.getOption('route'),
      controlsOptions: this.getOption('controls')
    };

    this.render_(new AppController(appOptions));
  };

  /**
   * Render a Backbone view
   * @param {Backbone.View} view
   * @private
   */
  aeris.RouteAppBuilder.prototype.render_ = function(view) {
    var el = this.getOption('div');
    el.innerHTML = '';

    view.render().$el.appendTo(el);
  };

  return aeris.RouteAppBuilder;
});
