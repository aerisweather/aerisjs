define(function() {
  return [
    {
      module: 'underscore',
      cdn: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min',
      global: '_',
      shim: {
        exports: '_',
        init: function() {
          return this._.noConflict();
        }
      }
    },
    {
      module: 'backbone',
      cdn: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
      global: 'Backbone',
      shim: {
        exports: 'Backbone',
        deps: ['vendor/underscore', 'vendor/jquery'],       // If we break out Backbone.View, we may be able to soften this dependency
        init: function() {
          return this.Backbone.noConflict();
        }
      }
    },
    {
      module: 'jquery',
      global: 'jQuery',
      cdn: '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min'
    },
    {
      module: 'handlebars',
      cdn: '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0/handlebars.min',
      global: 'Handlebars',
      shim: {
        exports: 'Handlebars'
      }
    }
  ];
});