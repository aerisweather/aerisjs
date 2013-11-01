define([
  'aeris/util'
], function(_) {

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
