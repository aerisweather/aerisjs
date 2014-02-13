(function(module) {
  var fs = require('fs');
  var path = require('path');
  var _ = require('underscore');
  
  var HandlebarsRegistrar = function(handlebars) {
    this.handlebars_ = handlebars;
  };
  
  HandlebarsRegistrar.prototype.registerHelpersInDir = function(helpersDir) {
    var helperPaths = fs.readdirSync(helpersDir);

    helperPaths.forEach(function(fileName) {
      var helpers = require(path.join(helpersDir, fileName));

      if (_.isFunction(helpers)) {
        // Register single helper, using file name
        this.handlebars_.registerHelper(path.basename(fileName, '.js'), helpers);
      }
      else {
        // Register an object of helpers
        // Using object keys as helper names
        _.each(helpers, function(helperFn, name) {
          this.handlebars_.registerHelper(name, helperFn);
        }, this);
      }
    }, this);
  };


  HandlebarsRegistrar.prototype.registerPartialsInDir = function(partialsDir) {
    var partialPaths = fs.readdirSync(partialsDir);

    partialPaths.forEach(function(fileName) {
      var html = fs.readFileSync(path.join(partialsDir, fileName), 'utf8');
      var partialName = fileName.split('.')[0];

      this.handlebars_.registerPartial(partialName, html);
    }, this);
  };
  
  module.exports = HandlebarsRegistrar;
}(module));