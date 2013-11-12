/**
 * Maps the strategy path
 * to a specified path within aeris/maps/.
 *
 * @param {string} strategy
 */
require.setStrategy = function(strategy) {
  require.config({
    map: {
      '*': {
        'strategy': strategy
      }
    }
  });
};

require.config({
  baseUrl: '/lib',
  //urlArgs: 'cb=' + Math.random(),                   // Cache buster
  paths: {
    async: '/tests/lib/async',
    jasmine: '/tests/lib/jasmine',
    'jasmine-html': '/tests/lib/jasmine-html',
    spec: '/tests/spec',
    mocks: '/tests/mocks',
    matchers: '/tests/lib/matchers',
    testErrors: '/tests/errors',
    testUtils: '/tests/testUtils',
    sinon: '/tests/lib/sinon',
    strategy: 'aeris/maps/gmaps'
  },
  shim: {
    jasmine: {
      exports: 'jasmine'
    },
    'jasmine-html': {
      deps: ['jasmine'],
      exports: 'jasmine'
    },
    'sinon': {
      exports: 'sinon'
    }
  },
  config: {
    aeris: {
      apiId: 'ezHWL0MiLsxwlN2ik8U4c',
      apiSecret: 'uCDMeSj91lBfIKCmeQkpeZjsAwUUQJHuKesCvqTm'
    }
  },
  waitSeconds: 3000
});
