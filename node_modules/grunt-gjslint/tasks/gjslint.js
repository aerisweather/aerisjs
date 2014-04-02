/*
 * grunt-gjslint
 * https://github.com/jmendiara/grunt-gjslint
 *
 * Copyright (c) 2013 Javier Mendiara Cañardo
 * Licensed under the MIT license.
 */

'use strict';

var gjslint = require('closure-linter-wrapper').gjslint;


module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('gjslint', 'Validate files with Google Linter',
    function() {
      var done = this.async();
      var options = this.options({
        force: true,
        reporter: {},
        flags: []
      });

      // Iterate over all specified file groups.
      this.files.forEach(function(f) {
        var src = expandFiles(f.src);

        gjslint({
          flags: options.flags,
          reporter: options.reporter,
          src: [src]
        }, function(err, res) {
          if (err) {
            if (err.code === 1 && !options.force) {
              done();
            } else {
              done(false);
            }
          } else {
            done();
          }
        });
      });
    }
  );

  function expandFiles(files) {
    var ret;
    if (files) {
      ret = grunt.file.expand(files)
        .filter(function(filepath) {
          // Warn on and remove invalid source files (if nonull was set).
          if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file "' + filepath + '" not found.');
            return false;
          } else {
            return true;
          }
        })
        .map(function(filePath) {
          // Wrap the path between double quotes when whitespaces found.
          return (filePath.indexOf(' ') === -1) ? filePath :
            ['"', filePath, '"'].join('');
        })
        .join(' ');
    }
    return ret;
  }
};
