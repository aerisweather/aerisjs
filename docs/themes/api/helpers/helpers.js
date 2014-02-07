(function(module) {
  var _ = require('underscore');
  var createNamespaceTree = require('../../../scripts/createnamespacetree');

  var helpers = {
    eachNamespace: function(classes, options) {
      var namespaces = createNamespaceTree(classes);
      var output = '';

      _.each(namespaces, function(nsObj) {
        output += options.fn(nsObj);
      });

      return output;
    },

    clean: function(text) {
      return text.split('!~YUIDOC_LINE~!')[0];
    }
  };

  module.exports = helpers;
}(module));