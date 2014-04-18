define([
  'aeris/util',
  'aeris/model',
  'aeris/builder/errors/builderconfigerror',
  'wire'        // Req'd for r.js to include wire package.
], function(_, Model, BuilderConfigError) {

  /**
   * An AppBuilder:
   * - Is a single entry point for starting up
   *   an application.
   * - Accepts an application configuration object
   *   from the user.
   * - Converts the user's config object into a
   *   AppBuilderOptions model.
   *   (which handles defaults/normalizing).
   * - Starts the application.
   * - Exposes some objects from the application
   *   to the user (via onload/onerror or the `build`
   *   method promise), allowing the user to interact
   *   directly with the application after the app builder
   *   has done it's work.
   *
   *
   * @class AppBuilder
   * @namespace aeris.builder
   *
   * @constructor
   * @throws aeris.builder.errors.BuilderConfigError
   *
   * @param {aeris.builder.maps.options.MapAppBuilderOptions} config MapBuilder configuration.
   * @param {aeris.builder.maps.options.AppBuilderOptions} builderOptions
   *        An injectable configuration instance.
   */
  var AppBuilder = function(config, builderOptions) {
    this.validateCtorArgs_(config, builderOptions);

    /**
     * @property options_
     * @type {aeris.builder.maps.options.AppBuilderOptions}
     * @private
     */
    this.options_ = builderOptions;
    this.options_.set(config);
  };


  /**
   * @throws aeris.builder.errors.BuilderConfigError
   * @private
   * @method validateCtorArgs_
   */
  AppBuilder.prototype.validateCtorArgs_ = function(config, builderOptions) {
    if (!config) {
      throw new BuilderConfigError('Expected a configuration object to be passed ' +
        'to the AppBuilder.');
    }
    if (!builderOptions || !(builderOptions instanceof Model)) {
      throw new BuilderConfigError('Expected a builderOptions object');
    }
  };


  /**
   * Builds the application.
   *
   * Should call onload/onerror callbacks
   * when complete,
   * as specified in the bulder configuration.
   *
   * @method
   * @abstract
   *
   * @return {aeris.Promise}
   *         A promise to build the application.
   *         May expose application components, or
   *         related objects.
   *
   * @method build
   */
  AppBuilder.prototype.build = _.abstractMethod;


  /**
   * Get a named option.
   *
   * @param {string} prop
   * @return {*}
   * @method getOption
   */
  AppBuilder.prototype.getOption = function(prop) {
    return this.options_.get(prop);
  };


  return AppBuilder;
});
