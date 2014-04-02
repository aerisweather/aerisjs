module.exports = {
  init: function(grunt) {
    var _ = require('underscore');

    var generateSpecRunner = function(options, opt_data) {
      var templateFile = grunt.file.expand(options.specRunnerTemplate);
      var template = grunt.file.read(templateFile);
      var excludedSpecs = grunt.file.expand(options.exclude);

      var data = _.defaults(opt_data || {}, {
        amdConfigModules: options.amdConfigModules,
        amdConfig: options.amdConfig,
        libs: options.libs,
        specs: getSpecPaths(),
        isPhantom: true,
        strategy: options.strategy
      });

      return grunt.template.process(template, {
        data: data
      });


      function getSpecPaths() {
        var filePaths = grunt.file.expand({
          filter: isSpecExcluded
        }, options.specs);

        return filePaths.map(getAmdPath);
      }

      function isSpecExcluded(specPath) {
        return excludedSpecs.indexOf(specPath) === -1;
      }

      function getAmdPath(fullPath) {
        return fullPath.split('.js')[0];
      }

    };

    return generateSpecRunner;
  }
}