/**
 * Create an app.js file
 * to use the sandbox.
 */
if (!window.apiKeys) {
  console.warn('%cNo api keys have been defined. You will be able to use base map ' +
    'features, but not the Aeris weather API. To access weather features, sign up for a free account at http://www.hamweather.com/account/signup/ ' +
    'then configure your keys in /sandbox/apikeys.js', 'font-size: larger');
}

require.config({
  baseUrl: '../../',
  config: {
    'aeris/config': (window.apiKeys ? {
      apiId: apiKeys.aeris.id,
      apiSecret: apiKeys.aeris.secret
    } : {})
  },
  paths: {
    'aeris/maps/strategy': 'src/maps/gmaps'
  }
});
require(['config-amd'], function() {
  require(['examples/sandbox/js/main']);
});
