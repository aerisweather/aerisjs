(function (module) {
  var path = require('path');
  var _ = require('underscore');
  var fs = require('fs');
  var handlebars = require('handlebars');

  function isPublicApi(obj) {
    return obj.hasOwnProperty('publicapi');
  }

  function ifHelper(isTrue, options, opt_ctx) {
    var ctx = opt_ctx || this;

    if (isTrue) {
      return options.fn(ctx);
    }
    else {
      return options.inverse(ctx);
    }
  }

  var NATIVES = {
    'Array': 1,
    'Boolean': 1,
    'Date': 1,
    'decodeURI': 1,
    'decodeURIComponent': 1,
    'encodeURI': 1,
    'encodeURIComponent': 1,
    'eval': 1,
    'Error': 1,
    'EvalError': 1,
    'Function': 1,
    'Infinity': 1,
    'isFinite': 1,
    'isNaN': 1,
    'Math': 1,
    'NaN': 1,
    'null': 1,
    'Number': 1,
    'Object': 1,
    'parseFloat': 1,
    'parseInt': 1,
    'RangeError': 1,
    'ReferenceError': 1,
    'RegExp': 1,
    'String': 1,
    'SyntaxError': 1,
    'TypeError': 1,
    'undefined': 1,
    'URIError': 1,
    'HTMLElement': 'https:/' + '/developer.mozilla.org/en/Document_Object_Model_(DOM)/',
    'HTMLCollection': 'https:/' + '/developer.mozilla.org/en/Document_Object_Model_(DOM)/',
    'DocumentFragment': 'https:/' + '/developer.mozilla.org/en/Document_Object_Model_(DOM)/',
    'HTMLDocument': 'https:/' + '/developer.mozilla.org/en/Document_Object_Model_(DOM)/'
  };

  var helpers = {

    joinEach: function(arr, separator, options) {
      var outputs = [];

      _.each(arr, function(item) {
        outputs.push(options.fn(item));
      });

      return outputs.join(separator);
    },

    // Returns namespace name without 'aeris' root
    nsName: function (nsObj) {
      if (!nsObj.name) {
        throw JSON.stringify(nsObj, null, 2);
      }
      var nsParts = nsObj.name.split('.');
      return nsParts.slice(1).join('.');
    },

    shortName: function(classObj) {
      var name = _.isString(classObj) ? classObj : classObj.name;

      if (!name) { return ''; }

      return _.last(name.split('.'));
    },

    getRef: function(className) {
      return GLOBAL.data.classes[className.trim()];
    },

    ifEquals: function(a , b, options) {
      return ifHelper(a === b, options, this);
    },

    ifPublicApi: function(cls, options) {
      var classObj = _.isString(cls) ? GLOBAL.data.classes[cls.trim()] : cls;
      var isClassPublicApi = !_.isUndefined(classObj) && isPublicApi(classObj);

      return ifHelper(isClassPublicApi, options, this);
    },

    ifTopLevelNs: function(namespaceName, options) {
      var isToplevelNs = namespaceName.split('.').length <= 2;

      return ifHelper(isToplevelNs, options, this);
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
    log: function (obj) {
      return '<script type="text/javascript">' +
        'console.log(window._log = ' + JSON.stringify(obj) + ');' +
        '</script>'
    }
  };

  module.exports = helpers;
}(module));