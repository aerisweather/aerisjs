define([
  'module',
  // Using vendor modules to avoid circular dependencies
  // as much as possible
  'backbone',
  'aeris/util'
], function(module, Backbone, _) {
  /**
   * Global configuration object for Aeris.js library.
   *
   * @class config
   * @namespace aeris
   * @extends aeris.Model
   * @publicApi
   *
   * @static
   */
  var Config = function(opt_attrs, opt_options) {
    /**
     * The map type strategy used to
     * load in map rendering components.
     *
     * @attribute strategy
     * @type {string}
     */
    /**
     * Aeris API id.
     *
     * @attribute apiId
     * @type {string}
     */
    /**
     * Aeris API secret.
     *
     * @attribute apiSecret
     * @type {string}
     */
    /**
     * Base url
     * @attribute assetPath
     * @type {string}
     */
    var attrs = _.defaults(opt_attrs || {}, {
      assetPath: '//cdn.aerisjs.com/assets/'
    });

    Backbone.Model.call(this, attrs, opt_options);


    // Bind config strategy to require
    // strategy path
    this.on('change:strategy', function() {
      require.config({
        map: {
          '*': {
            'aeris/maps/strategy': this.get('strategy')
          }
        }
      });
    }, this);
  };
  _.inherits(Config, Backbone.Model);


  /**
   * @method validate
   */
  Config.prototype.validate = function(attrs) {
    if (attrs.strategy && ['gmaps', 'openlayers'].indexOf(attrs.strategy) === -1) {
      throw new Error('Invalid map type strategy. Valid strategies are  ' +
        '\'gmaps\' or \'openlayers\'');
    }
  };


  /**
   * @param {string} strategy
   * @throws {Error} If no strategy is defined, or if
   *                the strategy is not valid.
   * @method setStrategy_
   * @private
   */
  Config.prototype.setStrategy_ = function(strategy) {
    if (!strategy) {
      throw new Error('Unable to set map type strategy: no strategy defined');
    }
    this.set('strategy', strategy, { validate: true });
  };


  /**
   * @method setApiId
   * @param {string} apiId
   */
  Config.prototype.setApiId = function(apiId) {
    this.set('apiId', apiId, { validate: true });
  };

  /**
   * @method setApiSecret
   * @param {string} setApiSecret
   */
  Config.prototype.setApiSecret = function(apiSecret) {
    this.set('apiId', apiSecret, { validate: true });
  };

  // Return a singleton config object,
  // propagated with any data from ReqJS's
  // config['aeris/config'] configuration.
  return _.expose(new Config(module.config()), 'aeris.config');
});
