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
  require('./deployment/grunt/config-paths')(grunt);

  require('./deployment/grunt/test')(grunt);
  require('./deployment/grunt/requirejs')(grunt);
  require('./deployment/grunt/docs')(grunt);
  require('./deployment/grunt/build')(grunt);
  require('./deployment/grunt/build-demo')(grunt);

  require('./deployment/grunt/deploy')(grunt);
  require('./deployment/grunt/deploy-staging')(grunt);

  require('./deployment/grunt/version')(grunt);
  require('./deployment/grunt/gzip')(grunt);
  require('./deployment/grunt/githooks')(grunt);
  require('./deployment/grunt/travis')(grunt);


  grunt.registerTask('default', [
    'build'
  ]);
};
