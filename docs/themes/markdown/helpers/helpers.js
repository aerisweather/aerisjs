(function(module) {
  var path = require('path');
  var _ = require('underscore');
  var projectConfig = GLOBAL.projectConfig;
  var handlebars = require('handlebars');

  function getShortName(objName) {
   return _.last(objName.split('.'));
  }

  var helpers = {
    apiDocLink: function(className, opt_displayText) {
      var displayText = _.isString(opt_displayText) ? opt_displayText : className;
      var href = path.join(projectConfig.apiDocsPath, 'classes/' + className + '.html');

      var link = '[`{displayText}`]({href})'.
        replace('{displayText}', displayText).
        replace('{href}', href);

      return new handlebars.SafeString(link);
    }
  };

  module.exports = helpers;
}(module));