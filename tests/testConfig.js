require.config({
  baseUrl: '/lib',
  //urlArgs: 'cb=' + Math.random(),                   // Cache buster
  paths: {
    tests: '../tests',
    jasmine: '../bower_components/jasmine/lib/jasmine-core/jasmine',
    'jasmine-slow': '../bower_components/jasmine-slow/lib/jasmine-slow',
    'jasmine-html': '/tests/lib/jasmine-html',
    async: '/tests/lib/async',
    sinon: '../bower_components/sinon/index',
    spec: '/tests/spec',
    mocks: '/tests/mocks',
    matchers: '/tests/lib/matchers',
    testErrors: '/tests/errors',
    testUtils: '/tests/testUtils',
    flag: '/tests/flag',
    'aeris/maps/strategy': 'aeris/maps/gmaps'
  },
  shim: {
    jasmine: {
      exports: 'jasmine'
    },
    'jasmine-html': {
      deps: ['jasmine'],
      exports: 'jasmine'
    },
    'jasmine-slow': {
      deps: ['jasmine'],
      exports: 'jasmine'
    },
    'sinon': {
      exports: 'sinon'
    }
  },
  map: {
    'tests/lib/jasmine-modified': {
      jasmine: 'jasmine'
    },
    '*': {
      jasmine: 'tests/lib/jasmine-modified'
    }
  },
  waitSeconds: 3
});
