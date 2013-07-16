require([
  '../lib/config',
  'testconfig'
], function() {
  require([
    'jasmine-html',
    'underscore',
    'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyDxTEbJsXwGRW4zDj8fpVsenDMMQGhZhUU&sensor=false'
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
      'spec/aeris/aerisapi',
      'spec/aeris/promise',
      'spec/aeris/maps/base/layers',
      'spec/aeris/maps/gmaps/route'
    ], function() {
      jasmineEnv.execute();
    });
  });
});