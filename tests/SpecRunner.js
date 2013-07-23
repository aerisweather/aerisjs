require([
  '../lib/config',
  'testconfig'
], function() {
  require([
    'jasmine-html',
    '/tests/jasmine-matchers.js',
    'underscore',
    'googlemaps'
  ], function(jasmine, underscore) {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
      return htmlReporter.specFilter(spec);
    };

    window._ = underscore;

    require([
      '/tests/lib/domReady.js!',
      'spec/jasmine-matchers',
      'spec/aeris/utils',
      'spec/aeris/aerisapi',
      'spec/aeris/promise',
      'spec/aeris/errors',
      'spec/aeris/maps/base/layers',
      'spec/aeris/maps/gmaps/route',
      'spec/integration/route',
      'spec/integration/markers'
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