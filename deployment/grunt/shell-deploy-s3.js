module.exports = function(grunt) {

  grunt.registerTask('deployS3', [
    'shell:deployS3-docs',
    'shell:deployS3-lib',
    'shell:deployS3-demo'
  ]);

  return {
    'deployS3-lib': {
      command: 'aws s3 cp <%=buildDirs.lib %> <%=deployBuckets.lib %> ' +
        '--recursive  ' +
        '--content-encoding gzip ' +
        '--cache-control max-age=1800 ' +
        '--quiet'
    },

    'deployS3-docs': {
      command: 'aws s3 cp <%=buildDirs.docs %> <%=deployBuckets.docs %> ' +
        '--recursive ' +
        '--cache-control max-age=1800 ' +
        '--quiet'
    },

    'deployS3-demo': {
      command: 'aws s3 cp <%=buildDirs.demo %> <%=deployBuckets.lib %> ' +
        '--recursive ' +
        '--cache-control max-age=1800 ' +
        '--quiet'
    }
  };
};
