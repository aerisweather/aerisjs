/**
 * @fileoverview Generates a copy of a r.js build configuration
 * which resolves all vendor lib paths to 'empty:'.
 *
 * This is so the r.js optimizer will not try to bundle vendor libs
 * into built packages. Instead, vendor lib modules are dynamically generated,
 * and pull in libs from either the global object or a remote source (eg. CDN).
 */
try {
  var _ = require('underscore'),
    requirejs = require('requirejs');
}
catch (e) {
  console.log('Cannot build r.js vendor path config: ' +
    'Underscore and requirejs node modules must be installed\n');
  process.exit(1);
}
  var fs = require('fs'),
  inPath = process.argv[2],
  outPath = process.argv[3],
  out = '',
  buildConfig = eval(fs.readFileSync(inPath, 'utf-8'));

if (!outPath || !inPath) {
  console.log('Must provide an input build file and an output path.' +
    'eg: node generateBuild.js buildConfig.js tmp/build.js');
  return;
}

// Pull in the vendor library configuration file
requirejs(['../lib/vendor/libs'], function(vendorLibs) {
  var vendorPaths = {};
  var out;

  // Create a paths object with empty vendor paths.
  _.each(vendorLibs, function(lib) {
    vendorPaths['vendor/' + lib.module] = 'empty:';
  });

  // Add the vendor paths to the original build config
  buildConfig.paths || (buildConfig.paths = {});
  _.extend(buildConfig.paths, vendorPaths);

  out = '(' + JSON.stringify(buildConfig, null, 2) + ')';

  // Write the build config to a new file.
  fs.writeFile(outPath, out, function(err) {
    if (err) {
      throw ('File save error: ' + err);
    }
    console.log('\n\n' + outPath + ' saved as: ' + out + '\n');
  });
});
