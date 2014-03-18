var _ = require('underscore');
var baseConfig = require('./base-lib');

module.exports = _.extend({}, baseConfig, {
  name: 'aeris/builder/maps/mapappbuilder',
  out: 'build/mapapp.js',


  include: [
    'aeris/packages/maps',
    'aeris/packages/gmaps'
  ],
  wrap: {
    startFile: [
      'deployment/config/frag/wrapstart.js.frag',
      'bower_components/requirejs/require.js'
    ],
    endFile: [
      'deployment/config/frag/mapapp-facade.js.frag',
      'deployment/config/frag/wrapend.js.frag'
    ]
  }
});
