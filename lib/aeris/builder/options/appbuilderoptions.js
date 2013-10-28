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
    var options;

    opt_options || (opt_options = {});

    options = _.defaults(opt_options, {
      defaults: _.defaults(opt_options.defaults || {}, {
        onload: function() {},
        onerror: function() {}
      })
    });

    /**
     * Defaults set via Backbone Model logic.
     *
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
   * Update the options, using a deep extend.
   *
   * @param {Object} config
   * @protected
   */
  AppBuilderOptions.prototype.set = function(key, value, opts) {
    var config;

    // Convert args to { key: value } format
    if (_.isString(key)) {
      (config = {})[key] = value;
    }
    else {
      config = key;

      // Options are the second argument
      opts = value;
    }

    // Normalize config
    config = this.normalize_(config);

    BaseModel.prototype.set.call(this, config, opts);
  };


  /**
   * This method is called every time attributes
   * are set on this model.
   *
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
