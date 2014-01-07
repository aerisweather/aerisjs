define([
  'module',
  // Using vendor modules to avoid circular dependencies
  // as much as possible
  'vendor/backbone',
  'aeris/util'
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
            'strategy': this.get('strategy')
          }
        }
      });
    }, this);
  };
  _.inherits(Config, Backbone.Model);


  /**
   * @override
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
   */
  Config.prototype.setStrategy = function(strategy) {
    if (!strategy) {
      throw new Error('Unable to set map type strategy: no strategy defined');
    }
    this.set('strategy', strategy, { validate: true });
  };


  // Return a singleton config object,
  // propagated with any data from ReqJS's
  // config['aeris/config'] configuration.
  return new Config(module.config());
});
