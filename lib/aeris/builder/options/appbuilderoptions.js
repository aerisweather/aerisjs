define(['aeris/util'], function(_) {
  /**
   * @typedef {Object} AppBuilderOptions
   *
   * @property {Function} onload
   *                      A function to call when the application
   *                      is sucessfully loaded.
   *
   * @property {Function} onerror
   *                      A function to call if the application builder
   *                      encounters errors when loading.
   */

  /**
   * Options for an {aeris.AppBuilder}
   *
   * @param {AppBuilderOptions=} opt_options
   * @class aeris.builder.options.AppBuilderOptions
   * @constructor
   */
  var AppBuilderOptions = function(opt_options) {
    this.options_ = this.getDefaultOptions();

    this.set(opt_options);
  };

  /**
   * Return the default configuration options.
   * Override in subclasses to set a default
   * configuration.
   */
  AppBuilderOptions.prototype.getDefaultOptions = function() {
    return {
      onload: function() {},
      onerror: function() {}
    };
  };

  /**
   * Update the options.
   *
   * @param {Object} config
   * @protected
   */
  AppBuilderOptions.prototype.set = function(config) {
    _.deepExtend(this.options_, this.normalizeOptions_(config));
  };


  /**
   * Get a named option.
   * @param {string} prop
   * @return {*}
   */
  AppBuilderOptions.prototype.get = function(prop) {
    return this.options_[prop];
  };


  /**
   * Override to provide any additional processing
   * needed for options object structure, etc.
   *
   * @param {AppBuilderOptions} options
   * @return {AppBuilderOptions}
   *
   * @protected
   */
  AppBuilderOptions.prototype.normalizeOptions_ = function(options) {
    return options;
  };

  return AppBuilderOptions;
});
