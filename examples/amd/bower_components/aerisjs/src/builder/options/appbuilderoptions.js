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
   * @class AppBuilderOptions
   * @namespace aeris.builder.options
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
     * @property defaults
     */
    this.defaults = options.defaults;

    /**
     * Aeris global configuration object.
     *
     * @type {aeris.Model}
     * @private
     * @property aerisConfig_
     */
    this.aerisConfig_ = aerisConfig;

    Model.call(this, opt_attrs, options);

    this.listenTo(this, {
      'change:apiId change:apiSecret': this.updateAerisConfig_
    });
    this.updateAerisConfig_();
  };
  _.inherits(AppBuilderOptions, Model);


  /**
   * @private
   * @method updateAerisConfig_
   */
  AppBuilderOptions.prototype.updateAerisConfig_ = function() {
    var aerisConfig;

    aerisConfig = this.pick(['apiId', 'apiSecret', 'path']);
    this.aerisConfig_.set(aerisConfig, { validate: true });
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
