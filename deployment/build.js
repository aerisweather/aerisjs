({
  appDir: '../lib',
  mainConfigFile: '../lib/config.js',
  baseUrl: '.',
  dir: '../build',
  fileExclusionRegExp: 'loader/loader.js',
  paths: {
    strategy: 'empty:',
    //vendor: 'empty:',
    'vendor/underscore': 'empty:',
    'vendor/backbone': 'empty:',
    'vendor/marionette': 'empty:',
    'vendor/jquery': 'empty:',
    'vendor/handlebars': 'empty:',

    // For an example of using
    // wire with r.js, see:
    // https://github.com/pieter-vanderwerff/backbone-require-wire
    'wire/build/amd/builder': 'vendor/wire/rjs/builder'
  },
  optimize: 'none',
  exclude: ['text']
})