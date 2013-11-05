/**
 * Use for environment specific requirejs configuration
 *  1. Duplicate file as /examples/initialize.js
 *  2. Enter you client ID and client secret
 *  3. Set the path property to the base dir of your repo
 */

/**
 * Maps the strategy path
 * to a specified path within aeris/maps/.
 *
 * @param {string} strategy
 */
require.setStrategy = function(strategy) {
  require.config({
    map: {
      '*': {
        'strategy': 'aeris/maps/' + strategy
      }
    }
  });
};

require.config({
  baseUrl: '[YOUR BASE URL]/lib',
  paths: {
    examples: '../examples',
    tests: '../tests'
  },
  config: {
    'aeris/config': {
      path: '/',
      apiId: '[YOUR AERIS API ID]',
      apiSecret: '[YOUR AERIS API SECRET]'
    }
  },
  waitSeconds: 2
});
require(['config', 'vendor/config'], function() {
  require(['examples/lib/domReady!'], function() {
    initialize();
  });
});
