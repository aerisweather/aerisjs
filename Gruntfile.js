module.exports = function(grunt) {
  var _ = require('underscore');
  var createRjsConfig = require('./deployment/scripts/createrjsconfig');
  var mapAppRjsConfig = require('./deployment/config/mapappbuilder');

  var notSpecs = [
    'tests/spec/**/mocks/*.js',
    'tests/spec/**/context.js',
    'tests/spec/**/fixtures/*.js',
    'tests/spec/**/config/**/*.js',
    'tests/spec/integration/helpers/**/*.js'
  ];
  var failingSpecs = [
    'tests/spec/aeris/commands/abstractcommand.js',
    'tests/spec/aeris/commands/commandmanager.js',
    'tests/spec/aeris/builder/maps/options/mapappbuilderoptions.js',
    'tests/spec/aeris/builder/maps/map/controllers/mapcontroller.js'
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

  // Project configuration.
  grunt.initConfig({
    buildDirs: {
      lib: 'build/lib',
      docs: 'build/docs'
    },
    pkg: grunt.file.readJSON('package.json'),
    'jasmine-amd': {
      options: {
        amdConfig: [
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
            concat(leafletSpecs),
          strategy: 'gmaps'
        }   // default strategy
      },
      gmaps: {
        options: {
          specs: gmapsSpecs,
          strategy: 'gmaps'
        }
      },
      leaflet: {
        options: {
          specs: leafletSpecs,
          strategy: 'leaflet'
        }
      }
    },
    version: {
      aeris: {
        src: [
          'package.json',
          'bower.json',
          'docs/yuidoc.json'
        ],
        options: {
          version: '<%=pkg.version %>'
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
    requirejs: {
      api: {
        options: createRjsConfig('api', {
          packages: [
            'aeris/packages/api'
          ],
          outDir: '<%=buildDirs.lib %>'
        })
      },
      'api.min': {
        options: createRjsConfig('api', {
          packages: [
            'aeris/packages/api'
          ],
          outDir: '<%=buildDirs.lib %>',
          minify: true
        })
      },

      gmaps: {
        options: createRjsConfig('gmaps', {
          packages: [
            'aeris/packages/gmaps'
          ],
          outDir: '<%=buildDirs.lib %>',
          strategy: 'gmaps'
        })
      },
      'gmaps.min': {
        options: createRjsConfig('gmaps', {
          packages: [
            'aeris/packages/gmaps'
          ],
          outDir: '<%=buildDirs.lib %>',
          minify: true,
          strategy: 'gmaps'
        })
      },

      'gmaps-plus': {
        options: createRjsConfig('gmaps-plus', {
          packages: [
            'aeris/packages/gmaps',
            'aeris/packages/api',
            'aeris/packages/geoservice'
          ],
          strategy: 'gmaps',
          outDir: '<%=buildDirs.lib %>'
        })
      },
      'gmaps-plus.min': {
        options: createRjsConfig('gmaps-plus', {
          packages: [
            'aeris/packages/gmaps',
            'aeris/packages/api',
            'aeris/packages/geoservice'
          ],
          strategy: 'gmaps',
          outDir: '<%=buildDirs.lib %>',
          minify: true
        })
      },

      'leaflet': {
        options: createRjsConfig('leaflet', {
          packages: [
            'aeris/packages/leaflet'
          ],
          strategy: 'leaflet',
          outDir: '<%=buildDirs.lib %>'
        })
      },
      'leaflet.min': {
        options: createRjsConfig('leaflet', {
          packages: [
            'aeris/packages/leaflet'
          ],
          strategy: 'leaflet',
          outDir: '<%=buildDirs.lib %>',
          minify: true
        })
      },

      'leaflet-plus': {
        options: createRjsConfig('leaflet-plus', {
          packages: [
            'aeris/packages/leaflet',
            'aeris/packages/api',

            'aeris/geolocate/freegeoipgeolocateservice',
            'aeris/geolocate/html5geolocateservice',
            'aeris/geocode/mapquestgeocodeservice'
          ],
          strategy: 'leaflet',
          outDir: '<%=buildDirs.lib %>'
        })
      },
      'leaflet-plus.min': {
        options: createRjsConfig('leaflet-plus', {
          packages: [
            'aeris/packages/leaflet',
            'aeris/packages/api',

            'aeris/geolocate/freegeoipgeolocateservice',
            'aeris/geolocate/html5geolocateservice',
            'aeris/geocode/mapquestgeocodeservice'
          ],
          strategy: 'leaflet',
          outDir: '<%=buildDirs.lib %>',
          minify: true
        })
      },

      mapApp: {
        options: _.extend({}, mapAppRjsConfig, {
          out: '<%=buildDirs.lib %>/mapapp.js'
        })
      },
      'mapApp.min': {
        options: _.extend({}, mapAppRjsConfig, {
          out: '<%=buildDirs.lib %>/mapapp.min.js',
          optimize: 'uglify2'
        })
      }
    },
    compass: {
      'api-docs': {
        options: {
          cssDir: 'docs/assets/css',
          sassDir: 'docs/themes/api/scss',
          imagesDir: 'docs/assets/images',
          fontsDir: 'docs/assets/fonts',
          javascriptsDir: 'docs/assets/js',
          relativeAssets: true,
          importPath: 'docs/themes/public/scss',
          force: true
        }
      },
      'public-docs': {
        options: {
          cssDir: 'docs/assets/css',
          sassDir: 'docs/themes/public/scss',
          imagesDir: 'docs/assets/images',
          fontsDir: 'docs/assets/fonts',
          javascriptsDir: 'docs/assets/js',
          relativeAssets: true
        }
      }
    },
    shell: {
      options: {
        failOnError: true
      },

      removeBuildDir: {
        command: 'rm -r build',
        options: {
          // Should not fail if build dir does not exist
          failOnError: false
        }
      },

      // @TODO: use YUIDoc grunt tasks
      //    so we're able to configure docs build here.
      //    (eg, we could build for local testing env, or for prod)
      generateDocs: {
        command: [
          // Create out dirs
          'mkdir -p ../<%=buildDirs.docs%>/api',

          // Generate public docs (using node script / handlebars)
          'node scripts/generatepublicdocs.js ../src themes/public ../<%=buildDirs.docs%>/index.html',

          // Geneate *.md docs (using node script / handlebars)
          'node scripts/generatemarkdowndocs.js themes/markdown ./',

          // Generate api docs (using yuidoc)
          '../node_modules/.bin/yuidoc -c yuidoc.json -o ../<%=buildDirs.docs%>/api'
        ].join('&&'),
        options: {
          execOptions: {
            cwd: 'docs'
          }
        }
      },

      copyAerisJs: {
        command: [
          'cp <%=buildDirs.lib %>/gmaps-plus.js <%=buildDirs.lib %>/aeris.js',
          'cp <%=buildDirs.lib %>/gmaps-plus.min.js <%=buildDirs.lib %>/aeris.min.js'
        ].join('&&')
      },

      copyAssets: {
        command: 'cp -r assets <%=buildDirs.lib %>'
      },

      copyLibToVersionDir: {
        command: [
          'mkdir <%=buildDirs.lib %>/<%=pkg.version%>',
          'cp <%=buildDirs.lib %>/*.js <%=buildDirs.lib %>/<%=pkg.version%>'
        ].join('&&')
      },

      copyDocsToVersionDir: {
        command: [
          'cp -r <%=buildDirs.docs %>/ build/docs-tmp',
          'mv build/docs-tmp <%=buildDirs.docs %>/<%=pkg.version%>'
        ].join('&&')
      },

      deployS3: {
        command: [
          'aws s3 cp <%=buildDirs.lib %> s3://aerisjs-cdn --recursive',
          'aws s3 cp <%=buildDirs.docs %> s3://aerisjs-docs --recursive'
        ].join('&&')
      }
    }
  });

  grunt.loadTasks('tasks/jasmine-amd');
  grunt.loadTasks('tasks/version');
  grunt.loadNpmTasks('grunt-gjslint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('test', [
    'jasmine-amd',
    'gjslint'
  ]);
  grunt.registerTask('build', [
    'test',
    'shell:removeBuildDir',
    'requirejs',
    'compass',
    'shell:copyAssets',
    'shell:generateDocs',
    'shell:copyAerisJs',
    'shell:copyLibToVersionDir',
    'shell:copyDocsToVersionDir'
  ]);
  grunt.registerTask('deploy', [
    'version:aeris',
    'build',
    'shell:deployS3'
  ]);
  grunt.registerTask('default', [
    'build'
  ]);
  grunt.registerTask('travis', [
    'version:aeris',
    'build'
  ]);
};
