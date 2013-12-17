var fs = require('fs'),
  path = require('path'),
  _ = require('underscore'),
  requirejs = require('requirejs'),
  exec = require('child_process').exec,
  basePackageConfig = require('./config/packageBuildConfig.json'),
  packageDirs = require('./config/packages.json').packageDirs;

main();


function main() {
  var configsForEachPackage = getPackageConfigsForDirs(packageDirs);

  if (!configsForEachPackage || !configsForEachPackage.length) {
    throw new Error('Failed to generate package configurations ' +
      'for packages in directories: ' + packageDirs.join(', '));
  }

  _.each(configsForEachPackage, optimizePackageConfig);
}


function getPackageConfigsForDirs(packageDirs) {
  var packageConfigs = [];

  _.each(packageDirs, function(packageDir) {
    var packageDefinitionFiles = fs.readdirSync(packageDir);

    _.each(packageDefinitionFiles, function(file) {
      var fullPath = packageDir + '/' + file;
      var pacakgeConfigForFile = {
        name: fullPath,
        out: '../build/lib/' + fullPath
      };
      var config = _.extend({}, basePackageConfig, pacakgeConfigForFile);

      packageConfigs.push(config);
    });
  })

  return packageConfigs;
}


function optimizePackageConfig(pkgConfig) {


  requirejs.optimize(pkgConfig, function(res) {
    logJSON(pkgConfig, 'Building package... ');
    console.log(res);
    console.log('...complete');
  }, function(err) {
    logJSON(pkgConfig, 'Failed optimizing package configuration: ' + err.message);
  });
}


function logJSON(json, opt_message) {
  if (opt_message) {
    console.log(opt_message + '\n\n');
  }
  console.log(JSON.stringify(json, null, 4));
}

