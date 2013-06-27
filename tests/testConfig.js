require.config({
  baseUrl: '/lib',
  urlArgs: 'cb=' + Math.random(),                   // Cache buster
  paths: {
    jasmine: '/tests/lib/jasmine',
    'jasmine-html': '/tests/lib/jasmine-html',
    spec: '/tests/spec'
  },
  shim: {
    jasmine: {
      exports: 'jasmine'
    },
    'jasmine-html': {
      deps: ['jasmine'],
      exports: 'jasmine'
    }
  },
  config: {
    aeris: {
      apiId: 'ezHWL0MiLsxwlN2ik8U4c',
      apiSecret: 'uCDMeSj91lBfIKCmeQkpeZjsAwUUQJHuKesCvqTm'
    }
  }
});