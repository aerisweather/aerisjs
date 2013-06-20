require([
  '../lib/config',
  'testConfig'
], function() {
  require(['jasmine-html'], function(jasmine) {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
      return htmlReporter.specFilter(spec);
    };

    require([
      '/tests/lib/domReady.js!'
      // list required specs here
    ], function() {
      jasmineEnv.execute();
    });
  });
});