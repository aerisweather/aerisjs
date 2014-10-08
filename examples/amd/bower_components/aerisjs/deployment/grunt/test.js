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
  grunt.loadNpmTasks('grunt-gjslint');


  grunt.registerTask('test', [
    'jasmine-legacy',
    'gjslint',

    // gjslint modifies files in the closure-linter-wrapper node module
    // every time you run it. This will remove those changes.
    'shell:ignore-closer-linter-changes'
  ]);

  grunt.config.merge({
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
    },

    gjslint: {
      options: {
        flags: [
          '--custom_jsdoc_tags=abstract,mixes,property,fires,method,event,chainable,augments,static,namespace,todo,readonly,alias,member,memberof,default,attribute,constant,publicApi,uses,override,for,throws,extensionfor',
          '--disable=0219,0110'
        ],
        reporter: {
          name: 'console'
        }
      },
      all: {
        src: 'src/**/*.js'
      }
    },

    shell: {
      'ignore-closer-linter-changes': {
        command: 'git checkout -- node_modules/closure-linter-wrapper/'
      }
    }
  });
};
