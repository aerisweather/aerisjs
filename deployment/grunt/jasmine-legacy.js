module.exports = function(grunt) {
  var notSpecs = [
    'tests/spec/**/mocks/*.js',
    'tests/spec/**/context.js',
    'tests/spec/**/fixtures/*.js',
    'tests/spec/**/config/**/*.js',
    'tests/spec/integration/helpers/**/*.js'
  ];
  var failingSpecs = [
    'tests/spec/aeris/commands/abstractcommand.js',
    'tests/spec/aeris/commands/commandmanager.js'
  ];
  var allSpecs = [
    'tests/spec/**/*.js'
  ];
  var gmapsSpecs = [
    'tests/spec/**/gmaps/**/*.js'
  ];
  var leafletSpecs = [
    'tests/spec/**/leaflet/**/*.js'
  ];
  var openLayersSpecs = [
    'tests/spec/**/openlayers/**/*.js'
  ];

  grunt.loadNpmTasks('grunt-jasmine-legacy');

  return {
    'jasmine-legacy': {
      options: {
        amdConfigModules: [
          '../config-amd',
          'testconfig'
        ],
        specs: allSpecs,
        libs: [
          'jasmine',
          'jasmine-console',
          'jasmine-html',
          'matchers/matchers.package'
        ],
        exclude: notSpecs.concat(failingSpecs)
      },
      core: {
        options: {
          exclude: notSpecs.
            concat(failingSpecs).
            concat(gmapsSpecs).
            concat(leafletSpecs).
            concat(openLayersSpecs),
          amdConfig: {
            paths: {
              'aeris/maps/strategy': 'src/maps/gmaps'
            }
          }
        }   // default strategy
      },
      gmaps: {
        options: {
          specs: gmapsSpecs,
          amdConfig: {
            paths: {
              'aeris/maps/strategy': 'src/maps/gmaps'
            }
          }
        }
      },
      openlayers: {
        options: {
          specs: openLayersSpecs,
          amdConfig: {
            paths: {
              'aeris/maps/strategy': 'src/maps/openlayers'
            }
          }
        }
      },
      leaflet: {
        options: {
          specs: leafletSpecs,
          amdConfig: {
            paths: {
              'aeris/maps/strategy': 'src/maps/leaflet'
            }
          }
        }
      }
    }
  };
};
