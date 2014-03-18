var _ = require('underscore');
var path = require('path');
var baseConfig = require('../config/base-lib');
var fs = require('fs');
var Handlebars = require('Handlebars');


var ConfigBuilder = function(packageName, opt_options) {
  this.packageName_ = packageName;

  this.options_ = _.defaults(opt_options || {}, {
    packages: [],
    minify: false,
    outDir: 'build/',
    optimizer: 'uglify2',
    strategy: 'gmaps',
    baseConfig: baseConfig,
    startWrapperTemplate: fs.readFileSync(__dirname + '/templates/start.js.frag.hbs', { encoding: 'utf8' }),
    endWrapperTemplate: fs.readFileSync(__dirname + '/templates/end.js.frag.hbs', { encoding: 'utf8' })
  });

  this.config_ = _.clone(this.options_.baseConfig);
};

ConfigBuilder.prototype.build = function() {
  this.setOutPath_();
  this.setOptimize_();
  this.setStrategy_();
  this.setIncludes_();
  this.setWrapper_();

  return this.config_;
};

ConfigBuilder.prototype.setOutPath_ = function() {
  var fileName = this.options_.minify ? this.packageName_ + '.min.js' : this.packageName_ + '.js';

  this.config_.out = path.join(this.options_.outDir, fileName);
};

ConfigBuilder.prototype.setOptimize_ = function() {
  this.config_.optimize = this.options_.minify ? this.options_.optimizer : 'none';
};

ConfigBuilder.prototype.setStrategy_ = function() {
  this.config_.paths = _.extend(this.config_.paths || {}, {
    'aeris/maps/strategy': 'src/maps/' + this.options_.strategy
  });
};

ConfigBuilder.prototype.setIncludes_ = function() {
  this.config_.include = this.options_.packages;
}

ConfigBuilder.prototype.setWrapper_ = function() {
  this.config_.wrap = {
    start: this.createStartWrapper_(),
    end: this.createEndWrapper_()
  };
};

ConfigBuilder.prototype.createStartWrapper_ = function() {
  return this.compileWrapperTemplate_(this.options_.startWrapperTemplate);
};

ConfigBuilder.prototype.createEndWrapper_ = function() {
  return this.compileWrapperTemplate_(this.options_.endWrapperTemplate);
};

ConfigBuilder.prototype.compileWrapperTemplate_ = function(template) {
  return Handlebars.compile(template)({
    packages: this.options_.packages
  });
};


module.exports = function(packageName, opt_options) {
  return new ConfigBuilder(packageName, opt_options).build();
};
