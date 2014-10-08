module.exports = function(grunt) {
  grunt.registerTask('travis', [
    'version',
    'build',
    'buildDemo',
    'gzip'
  ]);
};
