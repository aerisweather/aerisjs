module.exports = function(grunt) {
  var path = require('path');
  var phantomJSSpecRunner = require('./helpers/phantomjsspecrunner').init(grunt);
  var generateSpecRunner = require('./helpers/generatespecrunner').init(grunt);
  var chalk = require('chalk');
  var when = require('when');
  var fn = require('when/function');

  grunt.registerMultiTask('jasmine-amd', 'Run jasmine specs within AMD modules', function() {
    var done = this.async();
    var options = this.options({
      specRunnerTemplate: __dirname + '/templates/specrunner.html.tmpl',
      specs: [],
      exclude: [],
      libs: [],
      amdConfig: [],
      preserveSpecRunner: true,
      outDir: 'tests'
    });
    var tempFiles = [];
    var specRunnerPath = path.join(options.outDir, 'specrunner-tmp.html');


    fn.call(setup).
      then(run).
      then(done).
      catch(function(err) {
        var errObj = err instanceof Error ? err : new Error(err);
        done(errObj);
      }).
      finally(tearDown);


    function setup() {
      createTempFile(specRunnerPath, generateSpecRunner(options));
    }

    function run() {
      return phantomJSSpecRunner.run(specRunnerPath);
    }

    function tearDown() {
      destroyTempFiles();

      if (options.preserveSpecRunner) {
        grunt.file.write(path.join(options.outDir, 'specrunner.html'), generatePreservedSpecRunner());
      }
    }


    function generatePreservedSpecRunner() {
      return generateSpecRunner(options, {
        isPhantom: false
      });
    }


    function createTempFile(filePath, content) {
      grunt.file.write(filePath, content);
      tempFiles.push(filePath);
    }

    function destroyTempFiles() {
      tempFiles.forEach(function(filePath) {
        grunt.file.delete(filePath);
      });

      tempFiles.length = 0;
    }


  });
};