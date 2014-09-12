module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.config.merge({
    compress: {
      lib: {
        expand: true,
        src: ['**/*'],
        dest: '<%=buildDirs.lib %>',
        cwd: '<%=buildDirs.lib %>',
        options: {
          mode: 'gzip',
          level: 9
        }
      }
    },

    copy: {
      'without-gzip-extension': {
        expand: true,
        src: ['**/*.gz'],
        ext: '',
        extDot: 'last',
        dest: '<%=buildDirs.lib %>',
        cwd: '<%=buildDirs.lib %>'
      }
    },

    clean: {
      'remove-gzip-files': {
        src: ['build/**/*.gz']
      }
    }
  });

  grunt.registerTask('gzip', [
    'compress',
    'copy:without-gzip-extension',
    'clean:remove-gzip-files'
  ]);
};
