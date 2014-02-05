(function (module) {
  var _ = require('underscore');
  var handlebars = require('handlebars');

  function isPublicApi(obj) {
    return obj.hasOwnProperty('publicapi');
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

  function isNativeType(type) {
    return _.has(NATIVES, type);
  }


  function createNativeLink(name) {
    var linkTemplate = '<a class="ref" href="{href}" target="_blank">{content}</a>';
    var url = 'https:/' + '/developer.mozilla.org/en/JavaScript/Reference/Global_Objects/';
    if (NATIVES[name] !== 1) {
      url = NATIVES[name];
    }

    return linkTemplate.
      replace('{href}', url + name).
      replace('{content}', name);
  }

  function createLinkToObj(obj, content) {
    var href, target;
    var cssClass = "ref";
    var linkTemplate = '<a class="{class}" href="{href}" target="{target}">{content}</a>';

    if (isPublicApi(obj)) {
      href = '#' + obj.name;
      target = '_self';
    }
    else {
      href = '/docs/api/' + obj.name + '.html'
      target = '_blank';
    }


    return linkTemplate.
      replace('{href}', href).
      replace('{target}', target).
      replace('{class}', cssClass).
      replace('{content}', content);
  }

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

    linkTo: function (type, options) {
      var dataObj = GLOBAL.data.classes[type];

      if (dataObj) {
        return createLinkToObj(dataObj, options.fn(dataObj));
      }
      else if (isNativeType(type)) {
        return createNativeLink(type);
      }
      else {
        throw 'Unable to parse type \'' + type + '\'.';
      }
    },

    parseForTypes: function(text) {
      return text.replace(/(\{.*?\})/gi, function(match) {
        var type = match.substr(1, match.length - 2);

        if (isNativeType(type)) {
          return createNativeLink(type);
        }
        else if (GLOBAL.data.classes[type]) {
          return createLinkToObj(GLOBAL.data.classes[type], type);
        }
        else {
          throw 'Unable to parse type ' + match + '.';
        }
      });
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