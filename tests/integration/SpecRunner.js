require([
  '../../lib/config',
  '../testconfig'
], function() {
  require.config({
    paths: {
      spec: '../tests/integration/spec'
    }
  });
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

    require([
      'spec/markers',
      'spec/builder/route/routeappbuilder'
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