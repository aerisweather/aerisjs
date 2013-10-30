/**
 * @fileoverview Handlebars AMD loader plugin package definition.
 *                A little convoluted, but this is they only way I've made it work.
 */
require.config({
  hbs: {
    // Disable hbs loader helpers,
    // because it's hard to get the paths right.
    // Instead, we're loading them up as dependencies
    // in this main.js module definition.
    disableHelpers: true,
    disableI18n: true
  },
  paths: {
    'Handlebars': 'vendor/hbs/Handlebars',
    'underscore': 'vendor/underscore',
    'json2': 'vendor/json2',
    'i18nprecompile': 'vendor/i18nprecompile',
    helpers: 'vendor/hbs/helpers'
  },
  shim: {
    Handlebars: {
      exports: 'Handlebars'
    }
  }
});
define([
  'vendor/hbs/hbs',
  'helpers/helpers.handlebars',
  'helpers/i18n'
], function(hbs) {
  return hbs;
});
