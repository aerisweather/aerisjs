define([
  'aeris/util',
  'mapbuilder/core/module/module'
], function(_, BaseModule) {
  /**
   * Like a module... but with state.
   *
   * @class aeris.builder.maps.core.StateModule
   * @extends aeris.builder.maps.core.module.Module
   *
   * @constructor
   * @override
   *
   * @param {aeris.Model} options.appState Required.
   * @param {aeris.builder.maps.core.collection.MapObjectStateCollection} options.moduleState Required.
   * @param {string} options.appStateAttr
   *        The name with which to reference the module state
   *        within the application state.
   *
   *        This is assumed to be the same name used to reference
   *        related options within the builderOptions configuration.
   */
  var RoutedModule = function(options) {
    /**
     * Application state
     *
     * @type {aeris.Model}
     * @protected
     */
    this.appState_ = options.appState;


    /**
     * The state
     * of our map objects module.
     *
     * @type {aeris.builder.maps.core.collection.MapObjectStateCollection}
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
     */
    this.stateAttr_ = options.appStateAttr;


    BaseModule.call(this, options);
  };
  _.inherits(RoutedModule, BaseModule);

  return RoutedModule;
});
