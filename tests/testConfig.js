require.config({
  baseUrl: '/lib',
  //urlArgs: 'cb=' + Math.random(),                   // Cache buster
  paths: {
    jasmine: '/tests/lib/jasmine',
    'jasmine-html': '/tests/lib/jasmine-html',
    spec: '/tests/spec',
    async: '/tests/lib/async',
    sinon: '/tests/lib/sinon',
    jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min'
  },
  shim: {
    jasmine: {
      exports: 'jasmine'
    },
    'jasmine-html': {
      deps: ['jasmine'],
      exports: 'jasmine'
    },
    sinon: {
      exports: 'sinon'
    }
  },
  config: {
    aeris: {
      apiId: 'ezHWL0MiLsxwlN2ik8U4c',
      apiSecret: 'uCDMeSj91lBfIKCmeQkpeZjsAwUUQJHuKesCvqTm'
    }
  }
});