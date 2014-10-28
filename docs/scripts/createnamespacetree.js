(function(module) {
  var _ = require('underscore');

  var createNamespaceTree = function(classes) {
    var namespaceTree = {};

    classes.forEach(function(classObj) {
      var parent = namespaceTree;
      var namespaces = classObj.name.
        split('.').
        slice(0, -1); // remove class name from end

      namespaces.forEach(function(nsName, i) {
        var isLastNs = i === (namespaces.length - 1);
        var nsFullName = namespaces.slice(0, i + 1).join('.');

        if (!parent[nsName]) {
          parent[nsName] = {
            name: nsFullName,
            shortName: nsName,
            classes: [],
            namespaces: {}
          };
        }


        // Add class to final namespace
        if (isLastNs) {
          parent[nsName].classes.push(classObj);
        }

        // Move pointer forward
        parent = parent[nsName].namespaces;
      });
    });

    return namespaceTree;
  };

  module.exports = createNamespaceTree;
}(module));

/*
var namespaceTree = {
  namespaces: {
    animals: {
      classes: [
        { name: 'AyeAye' },
        { name: 'LivingThing' }
      ],
      namespaces: {
        seacreatures: {
          name: 'seacreatures',
          classes: [
            { name: 'MantisShrimp' },
            { name: 'MimicOctoput' }
          ]
        }
      }
    },
    minerals: {
      classes: [],
      namespaces: []
    }
  },
  classes: [
    { name: 'someBaseClass' }
  ]
};
*/
