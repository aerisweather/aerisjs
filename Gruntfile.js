module.exports = function(grunt) {
  var _ = require('underscore');

  // Project configuration.
  var config = _.extend({
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
          },

          // Manually update bower compoments
          // for demo, so we can use the lastest Aerisjs version
          // before it has been released publicly
          'update-amd-demo-aerisjs-bower-component': {
            command: [
              'cp -rf src <% buildDirs.demo %>/amd/bower_components/aerisjs'
            ].join('&&')
          }
        },
        require('./deployment/grunt/shell-deploy-s3')(grunt),
        require('./deployment/grunt/shell-deploy-s3-staging')(grunt),
        require('./deployment/grunt/shell-generate-docs')(grunt),
        require('./deployment/grunt/shell-copy-build')(grunt)
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
        'demo-api-keys': {
          expand: true,
          src: 'apikeys.demo.js',
          dest: '<%=buildDirs.demo %>',
          ext: '.js',
          cwd: 'examples/'
        },
        'examples-to-demo': {
          expand: true,
          src: '**/*',
          dest: '<%=buildDirs.demo %>',
          cwd: 'examples/'
        },
        'aeris-to-amd-demo-bower-component': {
          expand: true,
          src: '**/*',
          dest: '<%=buildDirs.demo %>/amd/bower_components/aerisjs/src',
          cwd: 'src/'
        }
      },

      clean: {
        'remove-gzip-files': {
          src: ['build/**/*.gz']
        }
      },

      replace: _.extend({},
        require('./deployment/grunt/replace-version')(grunt),
        require('./deployment/grunt/replace-demo-to-use-staging-version-of-aerisjs')(grunt)
      ),

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
    require('./deployment/grunt/gjslint')(grunt),
    require('./deployment/grunt/requirejs')(grunt),
    require('./deployment/grunt/compass')(grunt),
    require('./deployment/grunt/config-paths')(grunt)
  );

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-text-replace');

  // Also -- see githooks task.

  grunt.registerTask('test', [
    'jasmine-legacy',
    'gjslint',

    // gjslint modifies files in the closure-linter-wrapper node module
    // every time you run it. This will remove those changes.
    'shell:ignore-closer-linter-changes'
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
    'copy:examples-to-demo',
    'copy:aeris-to-amd-demo-bower-component',
    'copy:demo-api-keys'
  ]);

  grunt.registerTask('deploy-staging', [
    'build',
    'buildDemo',
    'replace:demo-to-use-staging-version-of-aerisjs',
    'gzip',
    'deployS3-staging'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'buildDemo',
    'gzip',
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
    'version',
    'build',
    'buildDemo',
    'gzip'
  ]);
};
