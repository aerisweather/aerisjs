/**
 * @fileoverview Handlebars AMD loader plugin package definition.
 *                A little convoluted, but this is they only way I've made it work.
 */
require.config({
  hbs: {
    disableI18n: true
  },
  paths: {
    'Handlebars': 'vendor/hbs/Handlebars',
    'underscore': 'vendor/underscore',
    'json2': 'vendor/json2',
    'i18nprecompile': 'vendor/i18nprecompile'
  },
  shim: {
    Handlebars: {
      exports: 'Handlebars'
    }
  }
});
define(['vendor/hbs/hbs'], function(hbs) {
  return hbs;
});
