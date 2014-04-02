module.exports = function(grunt) {
  var path = require('path');
  var phantomJSSpecRunner = require('./helpers/phantomjsspecrunner').init(grunt);
  var generateSpecRunner = require('./helpers/generatespecrunner').init(grunt);
  var chalk = require('chalk');
  var when = require('when');
  var fn = require('when/function');

  grunt.registerMultiTask('jasmine-legacy', 'Run jasmine specs within AMD modules', function(opt_specs) {
    var done = this.async();
    var options = this.options({
      specRunnerTemplate: __dirname + '/templates/specrunner.html.tmpl',
      specs: [],
      exclude: [],
      libs: [],
      amdConfig: {},
      amdConfigModules: [],
      preserveSpecRunner: true,
      outDir: 'tests'
    });
    var target = this.target;
    var tempFiles = [];
    var specRunnerPath = path.join(options.outDir, 'specrunner-tmp.html');

    // Use specs argument, if provided
    if (opt_specs) {
      options.specs = opt_specs.split(',');

      // Do not exclude any specs, if specs argument is passed
      options.exclude = [];
    }

    fn.call(setup).
      then(run).
      then(done).
      catch(function(err) {
        var errObj = err instanceof Error ? err : new Error(err);
        done(errObj);
      }).
      finally(tearDown);


    function setup() {
      var specs = grunt.file.expand(options.specs);
      var excludedSpecs = grunt.file.expand(options.exclude);
      grunt.verbose.write('Running specs: ' + JSON.stringify(specs, null, 2) + '\n');
      grunt.verbose.write('Excluding specs: ' + JSON.stringify(excludedSpecs, null, 2) + '\n');
      createTempFile(specRunnerPath, generateSpecRunner(options));
    }

    function run() {
      return phantomJSSpecRunner.run(specRunnerPath);
    }

    function tearDown() {
      destroyTempFiles();

      if (options.preserveSpecRunner) {
        grunt.file.write(path.join(options.outDir, 'specrunner-' + target + '.html'), generatePreservedSpecRunner());
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
