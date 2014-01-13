({
  name: 'vendor/almond',
  out: '../../../build/packages/gmaps-min.js',

  mainConfigFile: '../../../lib/config.js',
  baseUrl: '../../../lib',

  paths: {
    strategy: 'aeris/maps/gmaps'
  },

  optimize: 'uglify2',
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
    'packages/maps',
    'packages/gmaps'
  ],
  wrap: {
    startFile: ['../../frag/almond/start.frag.js'],
    endFile: ['../../frag/almond/end.frag.js']
  }
})
