({
  name: 'polaris/routeplanner/routeplannerbuilder',
  out: '../../../build/packages/routeplanner.js',

  mainConfigFile: '../../../lib/config.js',
  baseUrl: '../../../lib',

  paths: {
    'vendor/underscore': 'empty:',
    'vendor/backbone': 'empty:',
    'vendor/marionette': 'empty:',
    'vendor/jquery': 'empty:',

    strategy: 'aeris/maps/gmaps'
  },

  optimize: 'none',
  preserveLicenseComments: false,

  // Handlebars config
  inlineText: true,
  stubModules: ['text', 'hbars'],
  onBuildWrite : function(moduleName, path, content){
    // replace handlebars with the runtime version
    if (moduleName === 'Handlebars') {
      path = path.replace('handlebars.js','handlebars.runtime.js');
      content = fs.readFileSync(path).toString();
      content = content.replace(/(define\()(function)/, '$1"handlebars", $2');
    }
    return content;
  },

  include: [
    'vendor/config',

    'packages/maps',
    'packages/gmaps',
    'polaris/packages/routeplanner',

    'loader/libraryloader',
    'RiderX/loader'
  ],
  wrap: {
    startFile: ['../../../externals/require.js', '../../frag/start.frag.js'],
    endFile: ['../../frag/end.frag.js']
  }
})