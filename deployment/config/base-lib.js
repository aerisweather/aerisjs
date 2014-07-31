var fs = require('fs');

module.exports = {
  name: 'bower_components/almond/almond',

  mainConfigFile: 'config-amd.js',

  paths: {
    'aeris/maps/strategy': 'src/maps/gmaps',
    'leaflet': 'src/maps/leaflet/leaflet-amd',
    'mapbox': 'src/maps/leaflet/mapbox-amd'
  },

  optimize: 'none',

  preserveLicenseComments: false,

  // Handlebars config
  inlineText: true,
  stubModules: [
    // Text and hbars AMD plugin
    // build text files into optimized package
    'text', 'hbars',

    // jQuery is not required for
    // core aeris map library
    // (need to be stubbed, because Backbone thinks
    //  it needs it)
    'jquery'
  ],
  onBuildWrite: function(moduleName, path, content) {
    // replace handlebars with the runtime version
    if (moduleName === 'Handlebars') {
      path = path.replace('handlebars.js', 'handlebars.runtime.js');
      content = fs.readFileSync(path).toString();
      content = content.replace(/(define\()(function)/, '$1"handlebars", $2');
    }
    return content;
  }
}