module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
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
    shell: {
      removeBuildDir: {
        command: 'rm -r build'
      },

      // @TODO: use YUIDoc grunt tasks
      //    so we're able to configure docs build here.
      //    (eg, we could build for local testing env, or for prod)
      generateDocs: {
        command: '(cd docs; ./build.sh)'
      },

      // @TODO: use r.js grunt task
      //    and remove duplicate config
      //    from r.js config
      buildLib: {
        command: '(cd deployment; ./buildAll.sh)'
      },

      copyAerisJs: {
        command: [
          'cp build/cdn.aerisjs.com/gmaps-plus.js build/cdn.aerisjs.com/aeris.js',
          'cp build/cdn.aerisjs.com/gmaps-plus.min.js build/cdn.aerisjs.com/aeris.min.js'
        ].join('&&')
      },

      libVersion: {
        command: [
          'mkdir build/cdn.aerisjs.com/<%=pkg.version%>',
          'cp build/cdn.aerisjs.com/*.js build/cdn.aerisjs.com/<%=pkg.version%>'
        ].join('&&')
      },

      docsVersion: {
        command: [
          'cp -r build/docs.aerisjs.com/ build/docs-tmp',
          'mv build/docs-tmp build/docs.aerisjs.com/<%=pkg.version%>'
        ].join('&&')
      },

      deployS3: {
        command: [
          'aws s3 cp build/cdn.aerisjs.com s3://aerisjs-cdn --recursive',
          'aws s3 cp build/docs.aerisjs.com s3://aerisjs-docs.com --recursive'
        ].join('&&')
      }
    }
  });

  grunt.loadTasks('tasks/jasmine-amd');
  grunt.loadTasks('tasks/version');
  grunt.loadNpmTasks('grunt-gjslint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('test', [
    'jasmine-amd',
    'gjslint'
  ]);
  grunt.registerTask('build', [
    'shell:removeBuildDir',
    'shell:generateDocs',
    'shell:buildLib',
    'shell:copyAerisJs',
    'shell:libVersion',
    'shell:docsVersion'
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
};
