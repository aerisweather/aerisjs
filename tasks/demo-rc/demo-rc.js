var path = require('path');
var when = require('when');
var whenNode = require('when/node');
var mkdirp_p = whenNode.lift(require('mkdirp'));
var fs_p = whenNode.liftAll(require('fs'));    // Promisified version of fs.

module.exports = function demoRCTask(grunt) {
  grunt.registerMultiTask('demo-rc', 'Prepare Aeris.js demos for release candidate version (prep to deploy to uat)', function() {
    var done = this.async();
    var options = this.options({
      libSrcAttrPattern: /src="(.*aeris.*\.js)"/,
      libPathTemplate: 'lib/{{fileName}}'
    });

    when.map(this.files, copyProcessedFiles).
      then(done, done);

    /**
     *
     * @param {Object} file Grunt file object.
     */
    function copyProcessedFiles(file) {
      var makeDestDirst = makeDirsForFile.bind(null, file.dest);
      var copyFile = grunt.file.copy.bind(grunt.file, file.src[0], file.dest);
      var ext = path.extname(file.src[0]);

      grunt.verbose.writeln('ext: ' + ext);
      if (ext !== '.html') {
        copyFile();
        return;
      }

      return when(file.src[0]).
        tap(makeDestDirst).
        then(readFileUtf8).
        then(replaceAerisLibPath).
        then(writeFileUtf8.bind(null, file.dest));
    }

    function makeDirsForFile(filePath) {
      var dirName = path.dirname(filePath);

      return mkdirp_p(dirName);
    }

    function readFileUtf8(filePath) {
      return fs_p.readFile(filePath, {
        encoding: 'utf8'
      });
    }

    function writeFileUtf8(destPath, content) {
      return fs_p.writeFile(destPath, content, {
        encoding: 'utf8'
      });
    }

    function replaceAerisLibPath(fileContents) {
      return fileContents.replace(options.libSrcAttrPattern, replaceSrcAttr);
    }

    /**
     * Replace the <script> 'src' attribute.
     *
     * @param {String} srcAttr
     * @param {String} libPath
     * @return {String}
     */
    function replaceSrcAttr(srcAttr, libPath) {
      var libFileName = path.basename(libPath);
      var newLibFileName = options.libPathTemplate.replace('{{fileName}}', libFileName);
      var newSrcAttr = srcAttr.replace(libPath, newLibFileName);

      grunt.verbose.writeln('Replaced \'' + srcAttr + '\' with \'' + newSrcAttr);

      return newSrcAttr;
    }
  });
};
