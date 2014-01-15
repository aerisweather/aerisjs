
/**
 * @fileoverview RequireJS configuration for Aeris JS Maps.
 */

require.config({
  paths: {
    ai: 'aeris',

    // Bower Components
    'vendor/almond': 'vendor/bower_components/almond/almond',
    'vendor/backbone': 'vendor/bower_components/backbone/backbone',
    'vendor/markerclusterer': 'vendor/bower_components/gmaps-markerclusterer-plus/src/markerclusterer',
    'Handlebars': 'vendor/bower_components/handlebars/handlebars',
    hbars: 'vendor/bower_components/hbars/hbars',
    'vendor/jquery': 'vendor/bower_components/jquery/jquery',
    'vendor/marionette': 'vendor/bower_components/marionette/lib/backbone.marionette',
    'text': 'vendor/bower_components/requirejs-text/text',
    'vendor/underscore': 'vendor/bower_components/underscore/underscore'
  },
  map: {
    // Support Marionette AMD wrapper
    '*': {
      'vendor/marionette': 'vendor/marionette-amd'
    },

    'vendor/marionette-amd': {
      'vendor/marionette': 'vendor/marionette'
    },
    'vendor': {
      'vendor/marionette': 'vendor/marionette'
    }
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
    'vendor/underscore': {
      exports: '_'
    },
    'vendor/backbone': {
      exports: 'Backbone',
      deps: ['vendor/underscore', 'vendor/jquery']
    },
    'vendor/marionette': {
      exports: 'Backbone.Marionette',
      deps: ['vendor/underscore', 'vendor/backbone']
    },
    'vendor/jquery': {
      init: function() {
        return jQuery;
      }
    },

    'vendor/backbone.queryparams': {
      deps: ['vendor/underscore', 'vendor/backbone'],
      exports: 'Backbone'
    },
    'vendor/markerclusterer': {
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
