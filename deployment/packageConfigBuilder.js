
var fs = require('fs'),
  path = require('path'),
  _ = require('underscore'),
  requirejs = require('requirejs'),
  sys = require('sys'),
  exec = require('child_process').exec;

var baseConfig = {
  baseUrl: '../lib',
  mainConfigFile: '../lib/config.js',
  paths: {
    strategy: 'empty:',
    vendor: 'empty:'
  },
  optimize: 'none'
};

var dir = '../lib/aeris/maps/packages';
var files = fs.readdirSync(dir);

_.each(files, function(fileName) {
  var pkgConfig = _.extend({}, baseConfig, {
    name: 'packages/' + path.basename(fileName, '.js'),
    out: '../build/aeris/maps/packages/' + fileName
  });

  console.log(pkgConfig);

  // Execute r.js
  requirejs.optimize(pkgConfig, function(res) {
    console.log(res);
  });
});
