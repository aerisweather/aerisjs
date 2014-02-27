/**
 * Create an app.js file
 * to use the sandbox.
 */
require.config({
  baseUrl: '../../',
  paths: {
    'aeris/maps/strategy': 'src/maps/gmaps'
  },
  config: {
    'aeris/config': {
      apiId: apiKeys.aeris.id,
      apiSecret: apiKeys.aeris.secret
    }
  }
});
require(['config-amd'], function() {
  require(['examples/sandbox/js/app']);
});