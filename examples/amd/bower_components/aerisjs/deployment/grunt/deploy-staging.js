module.exports = function(grunt) {

  grunt.registerTask('deploy-staging', [
    'build',
    'buildDemo',
    'replace:demo-to-use-staging-version-of-aerisjs',
    'gzip',
    'shell:deployS3-staging-docs',
    'shell:deployS3-staging-lib',
    'shell:deployS3-staging-demo'
  ]);

  return grunt.config.merge({
    shell: {
      'deployS3-staging-docs': {
        command: 'aws s3 cp <%=buildDirs.docs %> <%=stagingBuckets.docs %> ' +
          '--recursive ' +
          '--cache-control no-cache ' +
          '--quiet'
      },

      'deployS3-staging-lib': {
        command: 'aws s3 cp <%=buildDirs.lib %> <%=stagingBuckets.lib %> ' +
          '--recursive  ' +
          '--content-encoding gzip ' +
          '--cache-control no-cache ' +
          '--quiet'
      },

      'deployS3-staging-demo': {
        command: 'aws s3 cp <%=buildDirs.demo %> <%=stagingBuckets.demo %> ' +
          '--recursive ' +
          '--cache-control no-cache ' +
          '--quiet'
      }
    },

    replace: {
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
    }
  });
};
