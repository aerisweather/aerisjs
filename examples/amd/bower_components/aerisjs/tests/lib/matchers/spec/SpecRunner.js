require([
  '../../../../lib/config',
  '../../../testconfig'
], function() {
  require([
    'jasmine-html',
    'matchers/matchers.package',
    'underscore',
    'googlemaps!'
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
      'matchers/spec/custom-matchers',
      'matchers/spec/route-matchers'
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
