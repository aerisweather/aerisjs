
var fs = require('fs'),
  path = require('path'),
  _ = require('underscore'),
  requirejs = require('requirejs'),
  sys = require('sys'),
  exec = require('child_process').exec;

var baseConfig = {
  mainConfigFile: '../lib/config.js',
  paths: {
    strategy: 'empty:',
    //vendor: 'empty:',
    'vendor/underscore': 'empty:',
    'vendor/backbone': 'empty:',
    'vendor/marionette': 'empty:',
    'vendor/jquery': 'empty:',
    'vendor/handlebars': 'empty:',
    'underscore': 'empty:',
    'backbone': 'empty:',

    // For an example of using
    // wire with r.js, see:
    // https://github.com/pieter-vanderwerff/backbone-require-wire
    //'wire/build/amd/builder': 'vendor/wire/rjs/builder'
  },
  optimize: 'none',
  exclude: ['vendor/text']
};

var dir = '../lib/aeris/maps/packages';
var files = fs.readdirSync(dir);

_.each(files, function(fileName) {
  var pkgConfig = _.extend({}, baseConfig, {
    name: 'packages/' + path.basename(fileName, '.js'),
    out: '../build/aeris/maps/packages/' + fileName
  });


  // Execute r.js
  requirejs.optimize(pkgConfig, function(res) {
    console.log('Building package: ' + fileName);
    console.log(JSON.stringify(pkgConfig, null, 4));
    console.log(res);
  }, function(err) {
    console.log(err);
    console.log(JSON.stringify(pkgConfig, null, 4));
  });
});
