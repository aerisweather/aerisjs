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
    var options = _.defaults(opt_options, {
      defaults: {}
    });

    // Set default defaults
    _.defaults(options.defaults, {
      onload: function() {},
      onerror: function() {}
    });

    /**
     * @override
     * @type {Object}
     */
    this.defaults = options.defaults;


    BaseModel.call(this, opt_attrs, options);

    // Force validation
    this.listenTo(this, 'change', function() {
      this.isValid();
    });
  };
  _.inherits(AppBuilderOptions, BaseModel);


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
