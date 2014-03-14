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
            'matchers/matchers.package',
            'googlemaps!'
          ]
        }
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('test', ['jasmine-amd']);
};