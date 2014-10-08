module.exports = function(grunt) {
  var _ = require('underscore');

  // Some common tasks
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-text-replace');

  // Project base configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    shell: {
      options: {
        failOnError: true
      }
    }
  });

  // External config files
  var configFiles = [
    'config-paths',

    'test',
    'requirejs',
    'docs',
    'build',
    'build-demo',

    'deploy',
    'deploy-staging',

    'version',
    'gzip',
    'githooks',
    'travis'
  ];
  configFiles.forEach(function(fileName) {
    require('./deployment/grunt/' + fileName)(grunt);
  });


  grunt.registerTask('default', [
    'build'
  ]);
};
