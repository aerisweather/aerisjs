define([
  'aeris/util',
  'aeris/model'
], function(_, BaseModel) {
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
   * Configuration options for an {aeris.AppBuilder}
   *
   * @class aeris.builder.options.AppBuilderOptions
   * @extends aeris.Model
   *
   * @constructor
   * @override
   *
   * @param {Object} opt_options.defaults
   */
  var AppBuilderOptions = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      defaults: {}
    });

    /**
     * Defaults set via Backbone Model logic.
     *
     * @override
     * @type {Object}
     */
    this.defaults = this.getDefaultOptions(options.defaults);


    BaseModel.call(this, opt_attrs, options);

    // Force validation
    this.listenTo(this, 'change', function() {
      this.isValid();
    });
  };
  _.inherits(AppBuilderOptions, BaseModel);


  /**
   * Return the default configuration options.
   *
   * Override in subclasses to set a default
   * configuration.
   *
   * Alternatively, you can set defaults by injecting the AppBuilderOptions
   * constructor with a `defaults` option.
   *
   * @param {Object=} opt_defaults
   *                  Additional default options. These defaults will take
   *                  precedence over any other defaults set in this method.
   *
   */
  AppBuilderOptions.prototype.getDefaultOptions = function(opt_defaults) {
    var defaults = opt_defaults || {};

    return _.defaults({
      onload: function() {},
      onerror: function() {}
    }, defaults);
  };

  /**
   * Update the options, using a deep extend.
   *
   * @param {Object} config
   * @protected
   */
  AppBuilderOptions.prototype.set = function(config, value, opts) {
    // Use a deep extend
    if (_.isObject(config)) {
      config = _.deepExtend({}, _.clone(this.attributes), this.normalize_(config));
    }

    BaseModel.prototype.set.call(this, config, value, opts);
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
  AppBuilderOptions.prototype.normalize_ = function(options) {
    return options;
  };


  return AppBuilderOptions;
});
