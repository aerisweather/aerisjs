define([
  'aeris/util',
  'vendor/marionette',
  'aeris/errors/invalidargumenterror'
], function(_, Marionette, InvalidArgumentError) {
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
   * @param {Object=} opt_options
   *
   * @param {Marionette.Region=} opt_options.region
   *        The region to serve as home for this
   *        module.
   *
   * @param {Marionette.Layout=} opt_options.moduleController
   *        The top-level controller for this module.
   *        If defined, this controller's view will be rendered
   *        on module initialization.
   *
   * @param {Object.<string,aeris.builder.maps.core.module.Module>=} opt_options.modules
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
    this.modules_ = options.modules;


    Marionette.Application.call(this);

    this.addInitializer(this.renderModuleView_);
    this.addInitializer(this.render);
    this.addInitializer(this.startChildModules_);
  };
  _.inherits(Module, Marionette.Application);


  /**
   * Render the top-level module view,
   * as defined by this moduleController option.
   *
   * @private
   */
  Module.prototype.renderModuleView_ = function() {
    if (this.moduleController_ && this.region_) {
      this.region_.show(this.moduleController_);
    }
  };


  /**
   * Render controllers associated with this module.
   * This method will be called on module initialization,
   * and will have access to the rendered module controller view (if defined).
   *
   * @param {aeris.builder.options.AppBuilderOptions} builderOptions
   */
  Module.prototype.render = function(builderOptions) {
    // You should probably find something useful to do here.
    // eg. this.region_.show(someAwesomeController);
  };


  /**
   * Set the module's region.
   * The region serves as the container
   * view for views create by this module.
   *
   * @param {Marionette.Region|string} region
   * @param {Marionette.Layout=} opt_layout
   *        If the region parameter is set as a string,
   *        this method will attempt to locate the named
   *        region within this layout object.
   */
  Module.prototype.setRegion = function(region, opt_layout) {
    var regionObj;

    // Region is a string
    // --> look for named region
    //     in the layout.
    if (_.isString(region)) {
      if (!(opt_layout instanceof Marionette.Layout)) {
        throw new InvalidArgumentError(opt_layout + ' is not a valid Layout object.');
      }

      regionObj = opt_layout[region];
    }
    else {
      regionObj = region;
    }

    if (!(regionObj instanceof Marionette.Region)) {
      throw new InvalidArgumentError(regionObj + ' is not a valid Region object.');
    }

    this.region_ = regionObj;
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
