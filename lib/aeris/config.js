define([
  'module',
  // Using vendor modules to avoid circular dependencies
  // as much as possible
  'backbone',
  'ai/util'
], function(module, Backbone, _) {
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
     * @attribute {string} path
     */
    var attrs = _.defaults(opt_attrs || {}, {
      path: 'http://uat.hamweather.net/eschwartz/'
    });

    Backbone.Model.call(this, attrs, opt_options);


    // Bind config strategy to require
    // strategy path
    this.on('change:strategy', function() {
      require.config({
        map: {
          '*': {
            'ai/maps/strategy': this.get('strategy')
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
   * @method setStrategy
   */
  Config.prototype.setStrategy = function(strategy) {
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
  }

  /**
   * @method setApiSecret
   * @param {string} setApiSecret
   */
  Config.prototype.setApiSecret = function(apiSecret) {
    this.set('apiId', apiId, { validate: true });
  }


  /**
   * Global configuration object for Aeris.js library.
   *
   * @class config
   * @namespace aeris
   * @publicApi
   *
   * @static
   */
  /**
   * Set configuration options for the Aeris.js library.
   *
   * @method set
   *
   * @param {Object} attrs
   * @param {string} attrs.apiId Aeris API client_id
   * @param {string} attrs.apiSecret Aeris API client_secret.
   */

  // Return a singleton config object,
  // propagated with any data from ReqJS's
  // config['ai/config'] configuration.
  return _.expose(new Config(module.config()), 'aeris.config');
});
