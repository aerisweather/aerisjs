module.exports = function(grunt) {
  grunt.config.merge({
    copy: {
      'examples-to-demo': {
        expand: true,
        src: '**/*',
        dest: '<%=buildDirs.demo %>',
        cwd: 'examples/'
      },
      'demo-api-keys': {
        expand: true,
        src: 'apikeys.demo.js',
        dest: '<%=buildDirs.demo %>',
        ext: '.js',
        cwd: 'examples/'
      },
      'aeris-to-amd-demo-bower-component': {
        expand: true,
        src: '**/*',
        dest: '<%=buildDirs.demo %>/amd/bower_components/aerisjs/src',
        cwd: 'src/'
      }
    }
  });

  grunt.registerTask('buildDemo', [
    'copy:examples-to-demo',
    'copy:aeris-to-amd-demo-bower-component',
    'copy:demo-api-keys'
  ]);
};
