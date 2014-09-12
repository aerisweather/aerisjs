module.exports = function(grunt) {

  return {
    'demo-to-use-staging-version-of-aerisjs': {
      src: ['<%=buildDirs.demo %>/**/*.html'],
      overwrite: true,
      replacements: [
        {
          from: '<%=deployPaths.lib %>',
          to: '<%=stagingPaths.lib %>'
        }
      ]
    }
  };
};
