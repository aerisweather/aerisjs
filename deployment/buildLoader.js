({
  baseUrl: '../lib',
  name: 'aeris/loader/loader',
  out: '../build/loader/loader.js',
  wrap: {
    startFile: ['../externals/require.js', 'start.frag.js'],
    endFile: ['end.frag.js']
  },
  paths: {
    strategy: 'empty:',
    vendor: 'empty:'
  },
  optimize: 'none',
  mainConfigFile: '../lib/config.js',
  // Include files we know we'll need.
  include: [
    'config',

    // This is only included if you use a .js file extension
    // because, well... you know... uh...
    'vendor/libs.js',
    'vendor/config.js',

    'base/abstractstrategy',
    'base/layerstrategies/abstractlayerstrategy',

    // Also include all of our lib loaders.
    'aeris/maps/loader'
  ]
})
