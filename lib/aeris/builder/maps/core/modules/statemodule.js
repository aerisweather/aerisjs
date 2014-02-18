define([
  'aeris/util',
  'aeris/application/modules/module'
], function(_, BaseModule) {
  /**
   * Like a module... but with state.
   *
   * - Registers module state with application state
   * - Provides interface for populated module state,
   *   using builderOptions config.
   *
   * @class StateModule
   * @namespace aeris.builder.maps.core
   * @extends aeris.application.modules.Module
   *
   * @constructor
   * @override
   *
   * @param {aeris.Model} options.appState Required.
   * @param {aeris.builder.maps.core.collections.MapObjectToggleCollection} options.moduleState Required.
   * @param {string} options.appStateAttr
   *        The name with which to reference the module state
   *        within the application state.
   *
   *        This is assumed to be the same name used to reference
   *        related options within the builderOptions configuration.
   */
  var StateModule = function(options) {
    /**
     * Application state
     *
     * @type {aeris.Model}
     * @protected
     * @property appState_
     */
    this.appState_ = options.appState;


    /**
     * The state
     * of our map objects module.
     *
     * @type {aeris.builder.maps.core.collections.MapObjectToggleCollection}
     * @property moduleState_
     */
    this.moduleState_ = options.moduleState;


    /**
     * The attr by which the map objects are referenced
     * within the application state.
     *
     * This should also be how the objects are referenced within
     * the builder config.
     *
     * @type {string}
     * @private
     * @property stateAttr_
     */
    this.stateAttr_ = options.appStateAttr;

    BaseModule.call(this, options);

    this.listenTo(this, 'initialize:before', function(opts) {
      // Sneak in these initializers,
      // so that our module state is populated
      // BEFORE everything else gets kicked-off.
      this.populateState_(opts);
      this.registerState_(opts);
    });

  };
  _.inherits(StateModule, BaseModule);


  /**
   * Populate the module state with data
   * from builderOptions config.
   *
   * Assumes that the stateAttr matches the builderOptions attribute.
   *
   * Override `registerState_` to process builderOptions config
   * before adding items to the module state.
   *
   * @param {aeris.builder.maps.options.MapAppBuilderOptions} builderOptions AppBuilder build config.
   * @protected
   * @method populateState_
   */
  StateModule.prototype.populateState_ = function(builderOptions) {
    var moduleStateObjects;
    var moduleOptions = builderOptions.get(this.stateAttr_);

    moduleStateObjects = this.processBuilderOptions_(moduleOptions);

    this.moduleState_.set(moduleStateObjects);
  };


  /**
   * Register the state of this module
   * with the application state.
   *
   * @param {aeris.builder.maps.options.MapAppBuilderOptions} builderOptions AppBuilder build config.
   * @protected
   * @method registerState_
   */
  StateModule.prototype.registerState_ = function(builderOptions) {
    // Register module state with the application state
    this.appState_.set(this.stateAttr_, this.moduleState_);
  };


  /**
   * Process a configuration from the
   * {aeris.builder.maps.options.MapAppBuilderOptions} builder options,
   * in order for it to be added to the module state.
   *
   * Override to provide custom processing. Defaults to passing
   * through original options configuration.
   *
   * @protected
   *
   * @param {*} moduleOptions
   *        Builder option associated with this module,
   *        based on this.stateAttr_.
   *
   * @return {Object} State object to be added to the module state collection.
   * @method processBuilderOptions_
   */
  StateModule.prototype.processBuilderOptions_ = function(moduleOptions) {
    return moduleOptions;
  };


  return StateModule;
});
