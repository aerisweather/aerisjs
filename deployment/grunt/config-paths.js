module.exports = function(grunt) {
  grunt.config.merge({
    buildDirs: {
      lib: 'build/lib',
      docs: 'build/docs',
      demo: 'build/demo'
    },
    deployBuckets: {
      lib: 's3://cdn.aerisjs.com',
      docs: 's3://docs.aerisjs.com',
      demo: 's3://demo.aerisjs.com'
    },
    deployPaths: {
      lib: '//cdn.aerisjs.com',
      docs: '//docs.aerisjs.com',
      demo: '//demo.aerisjs.com'
    },
    stagingBuckets: {
      lib: 's3://staging.aerisjs.com',
      docs: 's3://staging.aerisjs.com/docs',
      demo: 's3://staging.aerisjs.com/demo'
    },
    stagingPaths: {
      lib: '//staging.aerisjs.com',
      docs: '//staging.aerisjs.com/docs',
      demo: '//staging.aerisjs.com/demo'
    }
  });
};
