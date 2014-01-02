define('vendor/libs', function() {
  return [
    {
      module: 'underscore',
      cdn: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore',
      global: '_',
      shim: {
        exports: '_',
        init: function() {
          // Marionette needs global _
          //return this._.noConflict();
        }
      }
    },
    {
      module: 'backbone',
      cdn: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone',
      global: 'Backbone',
      shim: {
        exports: 'Backbone',
        deps: ['vendor/underscore', 'vendor/jquery'],       // If we break out Backbone.View, we may be able to soften this dependency
        init: function() {
          // Marionette needs global Backbone...
          //return this.Backbone.noConflict();
        }
      }
    },
    {
      module: 'marionette',
      cdn: '//cdnjs.cloudflare.com/ajax/libs/backbone.marionette/1.1.0-bundled/backbone.marionette',
      global: 'Marionette',
      shim: {
        exports: 'Marionette',
        deps: ['vendor/underscore', 'vendor/backbone']
      }
    },
    {
      module: 'jquery',
      global: 'jQuery',
      cdn: '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min'
    },
    {
      module: 'json2',
      cdn: '//cdnjs.cloudflare.com/ajax/libs/json2/20121008/json2',
      global: 'JSON'
    }
  ];
});
