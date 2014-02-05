(function(module) {
  var _ = require('underscore');

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
    'HTMLElement': 'https:/' + '/developer.mozilla.org/en/Document_Object_Model_(DOM)/{type}',
    'HTMLCollection': 'https:/' + '/developer.mozilla.org/en/Document_Object_Model_(DOM)/{type}',
    'DocumentFragment': 'https:/' + '/developer.mozilla.org/en/Document_Object_Model_(DOM)/{type}',
    'HTMLDocument': 'https:/' + '/developer.mozilla.org/en/Document_Object_Model_(DOM)/{type}',
    '*': 'https:/' + '/developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects'
  };

  var NATIVES_UNCAPITALIZED = {};
  _.each(NATIVES, function(val, key) {
    NATIVES_UNCAPITALIZED[uncaptialize(key)] = val;
  });

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function uncaptialize(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

  var TYPE_PATTERN = /(([\w\-]+(\.[\w-]+)+)|\w+|\*)/ig;

  var TypeContext = function(type) {
    this.type_ = type;

    return {
      name: this.type_,
      isNative: isNativeType(this.type_)
    };
  };

  function isNativeType(type) {
    // Match against uncapitalized,
    // so string === String
    return _.has(NATIVES_UNCAPITALIZED, uncaptialize(type));
  }

  function getTypeValue(type) {
    return NATIVES_UNCAPITALIZED[uncaptialize(type)];
  }

  var typeUtil = {
    /**
     * Replaces types in a string.
     * Block helper context provides:
     *    name: Type name (eg. aeris.Model or Array)
     *    isNative: Is object a native javascript type
     *
     * Example:
     *  {{#replaceTypes param.type}}     param.type = {Array.<aeris.Model>}
     *    {{#if isNative}}
     *      <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/{{name}}">
     *        {{name}}
     *      </a>
     *    {{else}}
     *      <a href="/docs/api/{{name}}.html>{{name}}</a>
     *    {{/if}}
     *  {{/each}}
     *
     *  Outputs:
     *  <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array">
     *    Array
     *  </a>
     *  .&lt;<a href="/docs/api/aeris.Model.html">aeris.Model</a>&gt;
     */
    eachType: function(typeString, options) {
      return typeString.replace(TYPE_PATTERN, function(type) {
        return options.fn(new TypeContext(type)).trim();
      }).trim();
    },

    eachTypeInText: function(text, options) {
      var OBJECT_REF_PATTERN = /(\{.*?\})/gi;       // eg {SomeObject} (anything in brackets)

      return text.replace(OBJECT_REF_PATTERN, function(match) {
        var matchWithoutBrackets = match.substr(1, match.length - 2);
        return typeUtil.eachType(matchWithoutBrackets, options);
      });
    },

    getMDNLink: function(type) {
      var typeValue;

      if (!isNativeType(type)) {
        throw new Error('Unable to get MDN link: ' + type + ' is not a native type.');
      }

      type = NATIVES[type] ? type : capitalize(type);

      typeValue = getTypeValue(type);
      if (typeValue === 1) {
        return 'https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/' + type;
      }
      else {
        return typeValue.replace('{type}', type);
      }
    }
  };

  module.exports = typeUtil;
}(module));
