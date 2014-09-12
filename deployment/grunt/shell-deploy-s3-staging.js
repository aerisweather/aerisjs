module.exports = function(grunt) {

  grunt.registerTask('deployS3-staging', [
    'shell:deployS3-staging-docs',
    'shell:deployS3-staging-lib',
    'shell:deployS3-staging-demo'
  ]);

  return {
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
  };
};
