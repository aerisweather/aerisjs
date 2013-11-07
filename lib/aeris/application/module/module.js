define([
  'aeris/util',
  'vendor/marionette'
], function(_, Marionette) {
  /**
   * Base Module class.
   *
   * A module:
   * - Is a plugin-pullout-able component of an application.
   * - Manages initialization and finalization work
   * - May have child modules, which will be started after the parent module.
   *
   * @class aeris.application.module.Module
   * @extends Marionette.Application
   *
   * @param {Object=} opt_options
   *
   * @param {Object.<string,aeris.application.module.Module>=} opt_options.modules
   *        A hash of named child modules, to
   *        be started with this module.
   *
   * @constructor
   */
  var Module = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      modules: {}
    });


    /**
     * Child modules.
     *
     * @type {Array.<string,Marionette.Application|Marionette.Module>}
     * @private
     */
    this.modules_ = options.modules;


    Marionette.Application.call(this);

    this.addInitializer(this.startChildModules_);
  };
  _.inherits(Module, Marionette.Application);


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
