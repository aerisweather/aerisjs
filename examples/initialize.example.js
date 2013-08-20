/**
 * Use for environment specific requirejs configuration
 *  1. Duplicate file as /examples/initialize.js
 *  2. Enter you client ID and client secret
 *  3. Set the path property to the base dir of your repo
 */
require(['../lib/config'], function() {
  require(['./lib/domReady!'], function() {
    require.config({
      baseUrl: '../../../lib',
      paths: {
        examples: '../examples',
        handlebars: '../examples/lib/handlebars',
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min'
      },
      config: {
        'aeris/config': {
          path: '../../../',
          apiId: '[YOUR CLIENT ID FOR THE AERIS API]',
          apiSecret: '[YOUR CLIENT SECRET FOR THE AERIS API]'
        }
      },
      shim: {
        'handlebars': {
          exports: 'Handlebars'
        }
      }
    });
    initialize();
  });
});
