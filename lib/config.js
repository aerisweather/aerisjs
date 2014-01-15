
/**
 * @fileoverview RequireJS configuration for Aeris JS Maps.
 */

require.config({
  paths: {
    ai: 'aeris',

    // Bower Components
    almond: 'vendor/bower_components/almond/almond',
    backbone: 'vendor/bower_components/backbone/backbone',
    markerclusterer: 'vendor/bower_components/gmaps-markerclusterer-plus/src/markerclusterer',
    Handlebars: 'vendor/bower_components/handlebars/handlebars',
    hbars: 'vendor/bower_components/hbars/hbars',
    jquery: 'vendor/bower_components/jquery/jquery',
    marionette: 'vendor/bower_components/marionette/lib/backbone.marionette',
    text: 'vendor/bower_components/requirejs-text/text',
    underscore: 'vendor/bower_components/underscore/underscore',

    // Wire dependency
    'wire/builder/rjs': 'vendor/bower_components/wire-rjs-builder/builder'
  },
  packages: [
    // Configure wire packages
    // See https://github.com/pieter-vanderwerff/backbone-require-wire
    // for an example of using ReqJs with Wire
    {
      name: 'wire',
      location: 'vendor/bower_components/wire',
      main: 'wire'
    },
    {
      name: 'when',
      location: 'vendor/bower_components/when',
      main: 'when'
    },
    {
      name: 'meld',
      location: 'vendor/bower_components/meld',
      main: 'meld'
    }
  ],
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      exports: 'Backbone',
      deps: ['underscore', 'jquery']
    },
    'marionette': {
      exports: 'Backbone.Marionette',
      deps: ['underscore', 'backbone']
    },
    'jquery': {
      init: function() {
        return jQuery;
      }
    },

    'vendor/backbone.queryparams': {
      deps: ['underscore', 'backbone'],
      exports: 'Backbone'
    },
    'markerclusterer': {
      exports: 'MarkerClusterer',
      init: function() {
        // Hack for lib not explicity assigned to global scope.
        return MarkerClusterer;
      }
    },
    'Handlebars': {
      exports: 'Handlebars',
      init: function() {
        // Hack for lib not explicity assigned to global scope.
        return Handlebars;
      }
    }
  },
  hbars: {
    extension: '.hbs'
  }
});
