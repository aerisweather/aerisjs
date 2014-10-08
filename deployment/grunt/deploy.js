module.exports = function(grunt) {

  grunt.registerTask('deploy-prod', [
    'deployOnlyOnStagingOrProd',
    'build',
    'buildDemo',
    'gzip',

    'shell:deployS3-docs',
    'shell:deployS3-lib',
    'shell:deployS3-demo'
  ]);

  grunt.registerTask('deploy-demo', [
    'buildDemo',
    'shell:deployS3-demo'
  ]);

  if (grunt.option('env') === 'prod') {
    grunt.registerTask('deploy', ['deploy-prod']);
  }
  else if (grunt.option('env') === 'staging') {
    grunt.registerTask('deploy', ['deploy-staing']);
  }


  grunt.registerTask('deployOnlyOnStagingOrProd', 'Shuts down the process if not on prod or staging', function() {
    var env = grunt.option('env');
    var isDeployableEnv = ['staging', 'prod'].indexOf(env) !== -1;

    if (!isDeployableEnv) {
      grunt.fail.fatal('Unable to deploy on env ' + env);
    }
  });

  return grunt.config.merge({
    shell: {
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
        command: 'aws s3 cp <%=buildDirs.demo %> <%=deployBuckets.demo %> ' +
          '--recursive ' +
          '--cache-control max-age=1800 ' +
          '--quiet'
      }
    }
  });
};
