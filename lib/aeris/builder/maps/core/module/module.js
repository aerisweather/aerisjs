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
   * @param {string} options.regionName
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
   * @constructor
   */
  var Module = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      moduleController: null,
      modules: {}
    });

    /**
     * The region within which the
     * maps module views should live.
     *
     * @type {Marionette.Region}
     * @private
     */
    if (options.region) {
      this.setRegion(opt_options.region);
    }


    /**
     * The top-level view controller for this
     * module.
     *
     * To have multiple views associated with this
     * module, use a layout as the moduleController.
     *
     * @type {?Backbone.View} Must define render/close methods.
     * @private
     */
    this.moduleController_ = options.moduleController;


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
    var modulesToStart = this.filterChildModules_(_.clone(this.modules_), builderOptions);

    _(modulesToStart).invoke('start', builderOptions);
  };


  /**
   * Filter which child modules to start with the parent
   * module.
   *
   * This method can be used to only start certain modules,
   * based on provided app configuration options.
   *
   * Defaults to passing through the original hash of modules.
   *
   * @protected
   *
   * @param {Array.<string,Marionette.Application|Marionette.Module>} modules
   *        Full list of available child modules.
   *
   * @param {aeris.builder.options.AppBuilderOptions} builderOptions
   *        App builder config.
   *
   * @return {Array.<string,Marionette.Application|Marionette.Module>}
   */
  Module.prototype.filterChildModules_ = function(modules, builderOptions) {
    return modules;
  };


  return Module;
});
