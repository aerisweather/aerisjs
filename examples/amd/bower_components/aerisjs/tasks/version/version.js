module.exports = function(grunt) {

  grunt.registerMultiTask('version', 'Set version number in specified json files', function(opt_version) {
    var done = this.async();
    var options = this.options({
      versionPattern: /"version":\s*"(.*?)"/gi
    });
    var version = opt_version || options.version;


    this.filesSrc.forEach(function(file) {
      var content = grunt.file.read(file);
      var updatedContent = content.replace(options.versionPattern, function(matchString, currentVersion) {
        return matchString.replace(currentVersion, version);
      });

      grunt.file.write(file, updatedContent);
    });

    done();
  });

};
