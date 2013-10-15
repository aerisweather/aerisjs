require([
  '../lib/config',
  'testconfig'
], function() {
  require([
    'jasmine-html',
    '../lib/vendor/config',
    'matchers/matchers.package',
    'googlemaps'
  ], function(jasmine, underscore) {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var reporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(reporter);

    jasmineEnv.specFilter = function(spec) {
      return reporter.specFilter(spec);
    };

    require([
      '/tests/lib/domReady.js!',

      'spec/aeris/model',
      //'spec/aeris/util',
      //'spec/aeris/events',
      //'spec/aeris/aerisapi',
      //'spec/aeris/promise',
      //'spec/aeris/emptypromise',
      //'spec/aeris/promisequeue',
      //'spec/aeris/errors',
      //'spec/aeris/datehelper',

      //'spec/aeris/builder/route/controller/controlscontroller',

      //'spec/aeris/geocode/mapquestgeocodeservice',
      //'spec/aeris/geocode/googlegeocodeservice',
      //'spec/aeris/geolocate/html5geolocateservice',
      //'spec/aeris/geolocate/freegeoipgeolocateservice',


      //'spec/aeris/commands/abstractcommand',
      //'spec/aeris/commands/commandmanager',


      'spec/aeris/maps/base/extension/mapextensionobject',
      //'spec/aeris/maps/base/layers',
      //'spec/aeris/maps/base/abstractlayer',

      //'spec/aeris/maps/base/markercollection',
      //'spec/aeris/maps/base/markercollections/apiendpoint',

      //'spec/aeris/maps/base/animations/abstractanimation',
      //'spec/aeris/maps/base/animations/animationsync',
      //'spec/aeris/maps/base/animations/aerisinteractivetile',
      //'spec/aeris/maps/gmaps/route',
      //'spec/aeris/maps/gmaps/layerstrategies/abstractmaptype',
      //'spec/aeris/maps/gmaps/layerstrategies/googlemaptype',
      //'spec/aeris/maps/gmaps/layerstrategies/tile',
      //'spec/aeris/maps/gmaps/layerstrategies/kml'
    ], function() {
      // Yes, it's a hack,
      // but it's solving some aweful async
      // loading issues...
      window.setTimeout(function() {
        jasmineEnv.execute();
      }, 500);
    });
  });
});
