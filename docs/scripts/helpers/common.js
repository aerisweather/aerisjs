(function(module) {
  var path = require('path');
  var _ = require('underscore');
  var projectConfig = GLOBAL.projectConfig;

  /**
   * Common template helpers.
   */
  var helpers = {
    getCDNPath: function(opt_packageName) {
      var isMissingConfig = !projectConfig || !projectConfig.cdnPath || !projectConfig.version;
      var packageName = _.isString(opt_packageName) && opt_packageName.length ?  opt_packageName : 'aeris';

      if (isMissingConfig) {
        throw new Error('Unable to output CDN path: project config must define cdnPath and version');
      }

      return projectConfig.cdnPath.
        replace('{VERSION}', projectConfig.version).
        replace('{PACKAGE}', packageName);
    },

    getApiDocUrl: function(className) {
      return path.join(projectConfig.apiDocsPath, 'classes/' + className + '.html');
    }
  };

  module.exports = helpers;
}(module));