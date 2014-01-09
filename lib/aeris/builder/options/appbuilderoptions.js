define([
  'aeris/util',
  'aeris/model',
  'aeris/config',
  'aeris/builder/errors/builderconfigerror'
], function(_, Model, aerisConfig, BuilderConfigError) {
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

    /**
     * Aeris global configuration object.
     * 
     * @type {aeris.Model}
     * @private
     */
    this.aerisConfig_ = aerisConfig;
    
    Model.call(this, opt_attrs, options);

    this.initializeApiKeys_();


    // Force validation
    this.isValid();
    this.listenTo(this, 'change', function() {
      this.isValid();
    });
  };
  _.inherits(AppBuilderOptions, Model);


  /** @private */
  AppBuilderOptions.prototype.initializeApiKeys_ = function() {
    var apiKeys;

    apiKeys = this.pick(['apiId', 'apiSecret']);
    this.aerisConfig_.set(apiKeys, { validate: true });
  };
  
  
  AppBuilderOptions.prototype.validate = function(attrs) {
    var isApiKeysAlreadySet = !!this.aerisConfig_.get('apiId') && !!this.aerisConfig_.get('apiSecret');
    var isApiKeysConfigured = attrs.apiId && attrs.apiSecret;

    if (!isApiKeysAlreadySet && !isApiKeysConfigured) {
      return new BuilderConfigError('An apiId and apiSecret must be provided ' +
        'in order to use the Aeris JS API');
    }
  };


  return AppBuilderOptions;
});
