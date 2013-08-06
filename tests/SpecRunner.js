require([
  '../lib/config',
  'testconfig'
], function() {
  require([
    'jasmine-html',
    'matchers/matchers.package',
    'vendor/underscore',
    'googlemaps'
  ], function(jasmine, underscore) {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var reporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(reporter);

    jasmineEnv.specFilter = function(spec) {
      return reporter.specFilter(spec);
    };

    window._ = underscore;

    require([
      '/tests/lib/domReady.js!',
      'spec/aeris/utils',
      'spec/aeris/events',
      'spec/aeris/commands/abstractcommand',
      'spec/aeris/commands/commandmanager',
      'spec/aeris/aerisapi',
      'spec/aeris/promise',
      'spec/aeris/promisequeue',
      'spec/aeris/errors',
      'spec/aeris/maps/base/extensions',
      'spec/aeris/maps/base/layers',
      'spec/aeris/maps/gmaps/route'
      //'spec/integration/route',
      //'spec/integration/markers'
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