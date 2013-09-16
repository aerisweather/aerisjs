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
      'spec/aeris/util',
      'spec/aeris/events',
      'spec/aeris/geocode/mapquestgeocodeservice',
      'spec/aeris/geocode/googlegeocodeservice',
      'spec/aeris/geolocate/html5geolocateservice',
      'spec/aeris/geolocate/freegeoipgeolocateservice',
      'spec/aeris/commands/abstractcommand',
      'spec/aeris/commands/commandmanager',
      'spec/aeris/aerisapi',
      'spec/aeris/promise',
      'spec/aeris/emptypromise',
      'spec/aeris/promisequeue',
      'spec/aeris/errors',
      'spec/aeris/maps/base/extensions',
      'spec/aeris/maps/base/layers',
      'spec/aeris/maps/base/markercollection',
      'spec/aeris/maps/base/markercollections/apiendpoint',
      'spec/aeris/maps/gmaps/route',
      'spec/aeris/builder/route/controller/controlscontroller'
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
