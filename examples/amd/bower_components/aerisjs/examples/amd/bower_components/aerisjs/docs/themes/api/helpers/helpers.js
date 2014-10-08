(function(module) {
  var _ = require('underscore');
  var createNamespaceTree = require('../../../scripts/createnamespacetree');
  var handlebars = require('yuidocjs').Handlebars;
  var fs = require('fs');
  var path = require('path');


  function registerPartialsInDir(partialsDir, prefix) {
    var partialPaths = fs.readdirSync(partialsDir);

    partialPaths.forEach(function(fileName) {
      var html = fs.readFileSync(path.join(partialsDir, fileName), 'utf8');
      var partialName = path.basename(fileName, '.handlebars');

      handlebars.registerPartial(prefix + '/' + partialName, html);
    });
  }

  // Register public theme partials
  // under 'public/' prefix.
  registerPartialsInDir(path.join(__dirname, '../../public/partials'), 'public');

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