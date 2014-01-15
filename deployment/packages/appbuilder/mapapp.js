({
  name: 'ai/builder/maps/mapappbuilder',
  out: '../../../build/packages/mapapp.js',

  mainConfigFile: '../../../lib/config.js',
  baseUrl: '../../../lib',

  paths: {
    'ai/maps/strategy': 'aeris/maps/gmaps'
  },

  optimize: 'none',
  preserveLicenseComments: false,

  // Handlebars config
  inlineText: true,
  stubModules: ['text', 'hbars'],
  // Use handlebars runtime script
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
    'config',
    'ai/packages/maps',
    'ai/packages/gmaps'
  ],
  wrap: {
    startFile: ['../../frag/builder/start.frag.js', '../../../externals/require.js'],
    endFile: ['../../frag/builder/end.frag.js']
  }
})