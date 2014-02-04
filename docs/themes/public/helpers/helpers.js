(function(module) {
  var _ = require('underscore');

  function isPublicApiClass(classObj) {
    return classObj.hasOwnProperty('publicapi');
  }

  function isPublicApiNs(ns) {
    var isPublicApi = false;

    function checkForPublicApiClasses(ns) {
      ns.classes.forEach(function(cls) {
        if (isPublicApiClass(cls)) { isPublicApi = true }
      });

      _.each(ns.namespaces, checkForPublicApiClasses);
    }
    checkForPublicApiClasses(ns);

    return isPublicApi;
  }

  function filterPublicApi(ns) {
    var namespaces = {};

    ns.classes = ns.classes.filter(isPublicApiClass);


    _.each(ns.namespaces, function(childNs, name) {
      if (isPublicApiNs(childNs)) {
        namespaces[name] = filterPublicApi(childNs);
      }
    });

    ns.namespaces = namespaces;

    return ns;
  }

  // Memeoize public apis
  var publicApis = {};
  function getPublicApi(ns) {
    if (!publicApis[ns.name]) {
      publicApis[ns.name] = filterPublicApi(ns);
    }

    return publicApis[ns.name];
  }

  var helpers = {

    ifPublicApi: function(classObj, options) {
      return isPublicApiClass(classObj) ? options.fn(this) : options.inverse(this);
    },

    ifPublicApiNs: function(ns, options) {
      return isPublicApiNs(ns) ? options.fn(this) : options.inverse(this);
    },

    logPublicApi: function(ns) {
      return helpers.log(getPublicApi(ns));
    },

    eachPublicNamespace: function(namespace, options) {
      var output = '';
      var publicApi = getPublicApi(namespace);

      _.each(publicApi.namespaces, function(ns) {
        output += options.fn(ns);
      });

      return output;
    },
    
    nsHeading: function(namespace) {
      var nsDepth = namespace.name.split('.').length;
      var headingLevel = nsDepth + 1;
      return '<h{lvl} id="#{id}">{shortName}</h{lvl}>'.
        replace('{lvl}', headingLevel).
        replace('{id}', namespace.name).
        replace('{shortName}', namespace.shortName);
    },

    // Returns namespace name without 'aeris' root
    nsName: function(nsObj) {
      var nsParts = nsObj.name.split('.');
      return nsParts.slice(1).join('.');
    },

    id: function(obj) {
      return obj.replace('.', '-');
    },

    className: function(classObj) {
      return _.last(classObj.name.split('.'));
    },

    /**
     * Log the object to the console.
     * Call {{{log this}}} to log entire page context.
     *
     * Note: must escape helper (ie. use triple brackets).
     *
     * @param {Object} obj
     * @return {string}
     */
    log: function(obj) {
      return '<script type="text/javascript">' +
        'console.log(window._log = ' + JSON.stringify(obj) + ');' +
        '</script>'
    }
  };

  module.exports = helpers;
}(module));