module.exports = function(grunt) {
  var _ = require('underscore');

  // Project configuration.
  var config = _.extend({
      buildDirs: {
        lib: 'build/lib',
        docs: 'build/docs',
        demo: 'build/demo'
      },
      pkg: grunt.file.readJSON('package.json'),

      shell: _.extend({
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



          'ignore-closer-linter-changes': {
            command: 'git checkout -- node_modules/closure-linter-wrapper/'
          }
        },
        require('./deployment/shell-deploy-s3')(grunt),
        require('./deployment/shell-generate-docs')(grunt),
        require('./deployment/shell-copy-build')(grunt)
      ),

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
        // Creates a copy of the /examples dir,
        // with script paths linking to files on the uat server.
        staging: {
          expand: true,
          src: ['**/*.*', '!**/', '!**/bower_components/**', '!**/sandbox/**'],
          dest: '<%=buildDirs.demo %>',
          cwd: 'examples/',
          options: {
            libPathTemplate: '//uat.hamweather.net/eschwartz/demo/lib/{{fileName}}'
          }
        }
      },

      // Use this task to set up git hooks
      githooks: {
        all: {
          // The intent of this hook is to prevent
          // build-breaking code from entering
          // deployable branches.
          'post-merge': 'test'
        }
      }
    },
    require('./deployment/grunt/jasmine-legacy')(grunt),
    require('./deployment/grunt/version')(grunt),
    require('./deployment/grunt/gjslilnt')(grunt),
    require('./deployment/grunt/requirejs')(grunt)
  );

  grunt.initConfig(config);

  grunt.loadTasks('tasks/demo-rc');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-githooks');

  // Also -- see githooks task.

  grunt.registerTask('test', [
    'jasmine-legacy',
    'gjslint',

    // gjslint modifies files in the closure-linter-wrapper node module
    // every time you run it. This will remove those changes.
    'shell:ignore-closer-linter-changes'
  ]);

  // Prepare demo site to deploy to uat (staging)
  // server (in build/demo
  grunt.registerTask('demo-uat', [
    'build',
    'demo-rc',
    'copy:lib-for-demo-rc'
  ]);

  grunt.registerTask('build', [
    'version',
    'test',
    'shell:removeBuildDir',
    'requirejs',
    'compass',
    'shell:generateDocs',
    'copyBuild'
  ]);

  grunt.registerTask('buildDemo', [
    'copy:demo',
    'copy:demo-api-keys'
  ]);

  grunt.registerTask('deploy', [
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
