module.exports = function(grunt) {
  grunt.loadTasks('tasks/version');

  return {
    version: {
      options: {
        version: '<%=pkg.version %>'
      },
      aeris: {
        src: [
          'package.json',
          'bower.json',
          'docs/yuidoc.json'
        ]
      },
      'aeris.VERSION': {
        src: ['deployment/scripts/templates/start.js.frag.hbs'],
        options: {
          version: '<%=pkg.version %>',
          versionPattern: /aeris\.VERSION\s=\s'(.*?)'/g
        }
      }
    }
  };
};
