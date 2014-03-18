module.exports = function(grunt) {
  var _ = require('underscore');
  var createRjsConfig = require('./deployment/scripts/createrjsconfig');
  var mapAppRjsConfig = require('./deployment/config/mapappbuilder');

  // Project configuration.
  grunt.initConfig({
    buildDirs: {
      lib: 'build/cdn.aerisjs.com',
      docs: 'build/docs.aerisjs.com'
    },
    pkg: grunt.file.readJSON('package.json'),
    'jasmine-amd': {
      aeris: {
        options: {
          specs: [
            'tests/spec/aeris/**/*.js'
          ],
          exclude: [
            // Non-specs
            'tests/spec/**/mocks/*.js',
            'tests/spec/**/context.js',
            'tests/spec/**/fixtures/*.js',
            'tests/spec/**/config/**/*.js',

            // Failing tests
            'tests/spec/aeris/commands/abstractcommand.js',
            'tests/spec/aeris/commands/commandmanager.js',
            'tests/spec/aeris/builder/maps/options/mapappbuilderoptions.js',
            'tests/spec/aeris/builder/maps/map/controllers/mapcontroller.js'
          ],

          amdConfig: [
            '../config-amd',
            'testconfig'
          ],

          libs: [
            'jasmine',
            'jasmine-console',
            'jasmine-html',
            'matchers/matchers.package'
          ]
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
            'aeris/packages/maps',
            'aeris/packages/gmaps'
          ],
          outDir: '<%=buildDirs.lib %>',
          strategy: 'gmaps'
        })
      },
      'gmaps.min': {
        options: createRjsConfig('gmaps', {
          packages: [
            'aeris/packages/maps',
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
            'aeris/packages/maps',
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
            'aeris/packages/maps',
            'aeris/packages/gmaps',
            'aeris/packages/api',
            'aeris/packages/geoservice'
          ],
          strategy: 'gmaps',
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
        command: '(cd docs; ./build.sh)'
      },

      yuidoc: {
        command: '(cd docs; ../node_modules/.bin/yuidoc -c yuidoc.json;)'
      },

      // @TODO: use r.js grunt task
      //    and remove duplicate config
      //    from r.js config
      buildLib: {
        command: '(cd deployment; ./buildAll.sh)'
      },

      copyAerisJs: {
        command: [
          'cp <%=buildDirs.lib %>/gmaps-plus.js <%=buildDirs.lib %>/aeris.js',
          'cp <%=buildDirs.lib %>/gmaps-plus.min.js <%=buildDirs.lib %>/aeris.min.js'
        ].join('&&')
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
    'shell:removeBuildDir',
    'requirejs',
    'shell:generateDocs',
    'shell:copyAerisJs',
    'shell:copyLibToVersionDir',
    'shell:copyDocsToVersionDir'
  ]);
  grunt.registerTask('deploy', [
    'version:aeris',
    'test',
    'build',
    'shell:deployS3'
  ]);
  grunt.registerTask('default', [
    'version:aeris',
    'test',
    'build'
  ]);
  grunt.registerTask('travis', [
    'requirejs',
    'shell:yuidoc'
  ]);
};
