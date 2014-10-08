module.exports = function(grunt) {
  var env = grunt.option('env');
  var prodBuckets = {
    lib: 's3://cdn.aerisjs.com',
    docs: 's3://docs.aerisjs.com',
    demo: 's3://demo.aerisjs.com'
  };
  var prodPaths = {
    lib: '//cdn.aerisjs.com',
    docs: '//docs.aerisjs.com',
    demo: '//demo.aerisjs.com'
  };
  var stagingBuckets = {
    lib: 's3://staging.aerisjs.com',
    docs: 's3://staging.aerisjs.com/docs',
    demo: 's3://staging.aerisjs.com/demo'
  };
  var stagingPaths = {
    lib: '//staging.aerisjs.com',
    docs: '//staging.aerisjs.com/docs',
    demo: '//staging.aerisjs.com/demo'
  };
  var configResolver = function(whenProd, whenStaging) {
    if (env === 'prod') {
      return whenProd;
    }
    if (env === 'staging') {
      return whenStaging;
    }
    return {};
  };

  grunt.config.merge({
    buildDirs: {
      lib: 'build/lib',
      docs: 'build/docs',
      demo: 'build/demo'
    },
    deployBuckets: configResolver(prodBuckets, stagingBuckets),
    deployPaths: configResolver(prodPaths, stagingPaths)
  });
};
