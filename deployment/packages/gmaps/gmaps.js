({
  name: 'base/map',
  out: '../../../build/packages/gmaps.js',

  mainConfigFile: '../../../lib/config.js',
  baseUrl: '../../../lib',

  map: {
    '*': {
      strategy: 'gmaps'
    }
  },

  paths: {
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
  exclude: ['text'],
  include: [
    'vendor/libs',
    'vendor/config',

    'packages/animations',
    'packages/infobox',
    'packages/layers',
    'packages/markers',
    'packages/gmaps',

    'loader/libraryloader',
    'aeris/maps/loader'
  ],
  wrap: {
    startFile: ['../../../externals/require.js', '../../start.frag.js'],
    endFile: ['../../end.frag.js']
  }
})
