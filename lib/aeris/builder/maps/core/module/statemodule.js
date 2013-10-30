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
   */
  var RoutedModule = function(options) {
    /**
     * Application state
     *
     * @type {aeris.Model}
     * @protected
     */
    this.appState_ = options.appState;


    BaseModule.call(this, options);
  };
  _.inherits(RoutedModule, BaseModule);

  return RoutedModule;
});
