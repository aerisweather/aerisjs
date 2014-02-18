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
        'aeris/maps/strategy': 'aeris/maps/' + strategy
      }
    }
  });
};

require.config({
  baseUrl: '/lib',
  paths: {
    examples: '../examples',
    tests: '../tests'
  },
  waitSeconds: 2
})

require(['config', 'examples/lib/domReady!', 'examples/apikeys'], function() {

  // Configure api keys
  require.config({
    config: {
      'aeris/config': {
        path: '/',
        apiId: apiKeys.aeris.id,
        apiSecret: apiKeys.aeris.secret
      },

      'aeris/geocode/config': {
        apiId: apiKeys.mapquest
      }
    },

    googlemaps: {
      params: {
        libraries: 'geometry',
        key: apiKeys.google
      }
    }
  });

  initialize();
});
