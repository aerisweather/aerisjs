module.exports = function(grunt) {
  var _ = require('underscore');
  var createRjsConfig = require('./deployment/scripts/createrjsconfig');

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

  // Project configuration.
  grunt.initConfig({
    buildDirs: {
      lib: 'build/lib',
      docs: 'build/docs',
      demo: 'build/demo'
    },
    pkg: grunt.file.readJSON('package.json'),
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
      options: {
        logLevel: grunt.option('verbose') ? 0 : 2     // 0 = TRACE, 2 = WARN
      },

      'aeris-api': {
        options: createRjsConfig('aeris-api', {
          packages: [
            'aeris/packages/api'
          ],
          outDir: '<%=buildDirs.lib %>'
        })
      },
      'aeris-api.min': {
        options: createRjsConfig('aeris-api', {
          packages: [
            'aeris/packages/api'
          ],
          outDir: '<%=buildDirs.lib %>',
          minify: true
        })
      },

      'aeris-gmaps': {
        options: createRjsConfig('aeris-gmaps', {
          packages: [
            'aeris/packages/gmaps'
          ],
          outDir: '<%=buildDirs.lib %>',
          strategy: 'gmaps'
        })
      },
      'aeris-gmaps.min': {
        options: createRjsConfig('aeris-gmaps', {
          packages: [
            'aeris/packages/gmaps'
          ],
          outDir: '<%=buildDirs.lib %>',
          minify: true,
          strategy: 'gmaps'
        })
      },

      'aeris-gmaps-plus': {
        options: createRjsConfig('aeris-gmaps-plus', {
          packages: [
            'aeris/packages/gmaps',
            'aeris/packages/api',
            'aeris/packages/geoservice'
          ],
          strategy: 'gmaps',
          outDir: '<%=buildDirs.lib %>'
        })
      },
      'aeris-gmaps-plus.min': {
        options: createRjsConfig('aeris-gmaps-plus', {
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

      'aeris-leaflet': {
        options: createRjsConfig('aeris-leaflet', {
          packages: [
            'aeris/packages/leaflet'
          ],
          strategy: 'leaflet',
          outDir: '<%=buildDirs.lib %>'
        })
      },
      'aeris-leaflet.min': {
        options: createRjsConfig('aeris-leaflet', {
          packages: [
            'aeris/packages/leaflet'
          ],
          strategy: 'leaflet',
          outDir: '<%=buildDirs.lib %>',
          minify: true
        })
      },

      'aeris-leaflet-plus': {
        options: createRjsConfig('aeris-leaflet-plus', {
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
      'aeris-leaflet-plus.min': {
        options: createRjsConfig('aeris-leaflet-plus', {
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
          'cp <%=buildDirs.lib %>/aeris-leaflet-plus.js <%=buildDirs.lib %>/aeris.js',
          'cp <%=buildDirs.lib %>/aeris-leaflet-plus.min.js <%=buildDirs.lib %>/aeris.min.js'
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

      'deployS3-docs': {
        command: 'aws s3 cp <%=buildDirs.docs %> s3://aerisjs-docs ' +
          '--recursive ' +
          '--cache-control max-age=1800 ' +
          '--quiet'
      },

      'deployS3-lib': {
        command: 'aws s3 cp <%=buildDirs.lib %> s3://aerisjs-cdn ' +
          '--recursive  ' +
          '--content-encoding gzip ' +
          '--cache-control max-age=1800 ' +
          '--quiet'
      },

      'deployS3-demo': {
        command: 'aws s3 cp <%=buildDirs.demo %> s3://demo.aerisjs.com ' +
          '--recursive ' +
          '--cache-control max-age=1800 ' +
          '--quiet'
      },

      'bower-update': {
        command: 'bower install && bower update'
      },

      'node-update': {
        command: 'npm install && npm update'
      },

      // Manually update bower compoments
      // for demo, so we can use the lastest Aerisjs version
      // before it has been released publicly
      'demo-bower-update': {
        command: [
          'rm -rf examples/amd/bower_components',
          'cp -r bower_components examples/amd',
          'mkdir examples/amd/bower_components/aerisjs',
          'cp -r src examples/amd/bower_components/aerisjs'
        ].join('&&')
      }
    },

    compress: {
      lib: {
        expand: true,
        src: ['**/*'],
        dest: '<%=buildDirs.lib %>',
        cwd: '<%=buildDirs.lib %>',
        options: {
          mode: 'gzip',
          level: 9
        }
      }
    },

    copy: {
      'without-gzip-extension': {
        expand: true,
        src: ['**/*.gz'],
        ext: '',
        extDot: 'last',
        dest: '<%=buildDirs.lib %>',
        cwd: '<%=buildDirs.lib %>'
      },
      demo: {
        expand: true,
        src: ['**/*', '!apikeys.*'],
        dest: '<%=buildDirs.demo %>',
        cwd: 'examples/'
      },
      'lib-for-demo-rc': {
        expand: true,
        src: ['**/*'],
        dest: '<%=buildDirs.demo %>/lib',
        cwd: 'build/lib'
      },
      'demo-api-keys': {
        expand: true,
        src: 'apikeys.demo.js',
        dest: '<%=buildDirs.demo %>',
        ext: '.js',
        cwd: 'examples/'
      }
    },

    clean: {
      'remove-gzip-files': {
        src: ['build/**/*.gz']
      }
    },

    'demo-rc': {
      staging: {
        expand: true,
        src: ['**/*.*', '!**/', '!**/bower_components/**', '!**/sandbox/**'],
        dest: '<%=buildDirs.demo %>',
        cwd: 'examples/',
        options: {
          libPathTemplate: '//uat.hamweather.net/eschwartz/demo/lib/{{fileName}}'
        }
      }
    }
  });

  grunt.loadTasks('tasks/version');
  grunt.loadTasks('tasks/demo-rc');
  grunt.loadNpmTasks('grunt-jasmine-legacy');
  grunt.loadNpmTasks('grunt-gjslint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('test', [
    'jasmine-legacy',
    'gjslint'
  ]);

  // Prepare demo site to deploy to uat (staging)
  // server.
  grunt.registerTask('demo-uat', [
    'build',
    'demo-rc',
    'copy:lib-for-demo-rc'
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

  grunt.registerTask('buildDemo', [
    'copy:demo',
    'copy:demo-api-keys'
  ]);

  // Update dependencies
  grunt.registerTask('update', [
    'shell:bower-update',
    'shell:node-update',
    'shell:demo-bower-update'
  ]);

  grunt.registerTask('deploy', [
    'version:aeris',
    'build',
    'buildDemo',
    'shell:deployS3-lib',
    'shell:deployS3-docs',
    'shell:deployS3-demo'
  ]);

  grunt.registerTask('deployDemo', [
    'buildDemo',
    'shell:deployS3-demo'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

  grunt.registerTask('gzip', [
    'compress',
    'copy:without-gzip-extension',
    'clean:remove-gzip-files'
  ]);

  grunt.registerTask('travis', [
    'version:aeris',
    'build',
    'buildDemo',
    'gzip'
  ]);
};
