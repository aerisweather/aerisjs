/**
 * Use for environment specific requirejs configuration
 *  1. Duplicate file as /examples/initialize.js
 *  2. Enter you client ID and client secret
 *  3. Set the path property to the base dir of your repo
 */
require.config({
  baseUrl: '/lib',
  paths: {
    examples: '/examples'
  }
});
require(['config'], function() {
  require(['examples/lib/domReady!', 'vendor/config'], function() {
    require.config({
      baseUrl: '/lib',
      config: {
        'aeris/config': {
          path: '/',
          apiId: '[YOUR AERIS API ID]',
          apiSecret: '[YOUR AERIS API SECRET]'
        }
      }
    });
    initialize();
  });
});
