/**
 * @fileoverview Provides AMD wrappers around Marionette components.
 */
(function() {
  var components = [
    'ItemView',
    'CollectionView',
    'CompositeView',
    'Layout',
    'View',

    'Region',
    'RegionManager',
    'Renderer',
    'TemplateCache',

    'Application',
    'Module',
    'Controller',

    'Commands',
    'RequestResponse',

    'AppRouter',
    'Callbacks',
    'functions'
  ];

  // Base Marionette module
  define('vendor/marionette-amd', [
    'vendor/marionette'
  ], function(Marionette) {
    return Marionette;
  });

  for (var i = 0; i < components.length; i++) {
    (function(Component) {
      define('vendor/marionette-amd/' + Component.toLowerCase(), [
        'vendor/marionette'
      ], function(Marionette) {
        return Marionette[Component];
      });
    })(components[i]);
  }

})();
