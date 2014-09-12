module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-githooks');

  grunt.config.merge({
    githooks: {
      all: {
        // The intent of this hook is to prevent
        // build-breaking code from entering
        // deployable branches.
        'post-merge': 'test'
      }
    }
  });
};
