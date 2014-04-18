(function(module) {
  var path = require('path');
  var _ = require('underscore');
  var projectConfig = GLOBAL.projectConfig;
  var handlebars = require('handlebars');

  function createRefLink(displayText, href) {
    return '[`{displayText}`]({href})'.
      replace('{displayText}', displayText).
      replace('{href}', href);
  }

  var helpers = {
    apiDocLink: function(className, opt_displayText) {
      var displayText = _.isString(opt_displayText) ? opt_displayText : className;
      var href = projectConfig.apiDocsPath +  '/classes/' + className + '.html';

      return new handlebars.SafeString(createRefLink(displayText, href));
    },

    publicDocLink: function(className, opt_displayText) {
      var displayText = _.isString(opt_displayText) ? opt_displayText : className;
      var href = [projectConfig.publicDocsPath, className].join('#');

      return new handlebars.SafeString(createRefLink(displayText, href));
    }
  };

  module.exports = helpers;
}(module));