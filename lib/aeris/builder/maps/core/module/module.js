define([
  'aeris/util',
  'vendor/marionette/application'
], function(_, BaseApplication) {
  /**
   * Base Module class.
   *
   * A module:
   * - Is a plugin-pullout-able component of an application.
   * - Has a region, where it can render controllers
   * - Manages other initialization and finalization work
   * - May have child modules, which will be started after the parent module.
   *
   * @class aeris.builder.maps.core.module.Module
   * @extends Marionette.Application
   *
   * @param {Object} options
   *
   * @param {string} options.region
   *        The name of the region within which our
   *        controllers should be rendered.
   *
   * @param {Marionette.Layout} options.layout
   *        The layout in which our named region
   *        is rendered.
   *
   * @param {Object.<string,aeris.builder.maps.core.module.Module>=} options.modules
   *        A hash of named child modules, to
   *        be started with this module.
   *
   * @param {Object.<string,Backbone.View>=} options.controllers
   *        A hash of named controllers to render.
   *
   * @constructor
   */
  var Module = function(options) {
    /**
     * The region within which the
     * maps module views should live.
     *
     * @type {Marionette.Region}
     * @private
     */
    this.region_ = options.layout[options.regionName];


    /**
     * Child modules.
     *
     * @type {Array.<string,Marionette.Application|Marionette.Module>}
     * @private
     */
    this.modules_ = options.modules || {};


    BaseApplication.call(this);

    this.addInitializer(this.render);

    this.addInitializer(this.startChildModules_);
  };
  _.inherits(Module, BaseApplication);


  /**
   * Render controllers associated with this module.
   * This method will be called on module initialization.
   *
   * @param {aeris.builder.options.AppBuilderOptions} builderOptions
   */
  Module.prototype.render = function(builderOptions) {
    // You should probably find something useful to do here.
    // eg. this.region_.show(someAwesomeController);
  };


  /**
   * Start-up child modules
   *
   * @param {aeris.builder.options.AppBuilderOptions} builderOptions
   * @protected
   */
  Module.prototype.startChildModules_ = function(builderOptions) {
    _.each(this.modules_, function(module) {
      module.start(builderOptions);
    }, this);
  };


  return Module;
});
