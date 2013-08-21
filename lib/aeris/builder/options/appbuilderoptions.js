define(['aeris/util'], function(_) {
  /**
   * @typedef {Object} AppBuilderConfig
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
   * @param {AppBuilderConfig=} opt_options
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
    _.deepExtend(this.options_, config);
  };


  /**
   * Get a named option.
   * @param {string} prop
   * @return {*}
   */
  AppBuilderOptions.prototype.get = function(prop) {
    return this.options_[prop];
  };


  return AppBuilderOptions;
});
