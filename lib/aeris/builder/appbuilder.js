define([
  'aeris/util',
  'aeris/builder/options/appbuilderoptions'
], function(_, AppBuilderOptions) {

  /**
   *
   * @class aeris.builder.AppBuilder
   *
   * @constructor
   *
   * @param {aeris.builder.maps.options.MapAppBuilderOptions} config MapBuilder configuration.
   * @param {aeris.builder.maps.options.AppBuilderOptions} builderOptions
   *        An injectable configuration instance.
   */
  var AppBuilder = function(config, builderOptions) {
    this.options_ = builderOptions;
    this.options_.set(config, { validate: true });
  };


  /**
   * Build the application
   *
   * @method
   * @abstract
   *
   * @return {*} Objects to expose to the client.
   */
  AppBuilder.prototype.build = _.abstractMethod;


  /**
   * Get a named option.
   *
   * @param {string} prop
   * @return {*}
   */
  AppBuilder.prototype.getOption = function(prop) {
    return this.options_.get(prop);
  };

  return AppBuilder;
});
