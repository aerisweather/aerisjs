define([
  'aeris/util',
  'vendor/marionette/application'
], function(_, BaseApplication) {
  /**
   *
   * @class aeris.builder.maps.core.RoutedModule
   * @extends Marionette.Application
   *
   * @constructor
   * @override
   */
  var RoutedModule = function(options) {
    /**
     * Application state
     *
     * @type {aeris.Model}
     * @private
     */
    this.state_ = options.state;


    BaseApplication.call(this, options);
  };
  _.inherits(RoutedModule, BaseApplication);

  return RoutedModule;
});
