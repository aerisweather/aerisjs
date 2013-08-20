define([
  'aeris',
  'vendor/underscore'
], function(aeris, _) {

  /**
   * @fileoverview Provides various utility methods.
   */

  /**
   * For providing unique client ids
   *
   * @private
   * @type {number}
   */
  var idCounter = 0;

  aeris.provide('aeris.utils');

  /**
   * Arrary.indexOf shim
   * From Mozilla Dev Network
   */
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement/*, fromIndex */) {
      "use strict";
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;

      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    }
  }

  /**
   *
   * @const
   */
  aeris.utils = {
    /**
     * Tests whether 'obj' is an Array.
     * Borrowed from jQuery
     *
     * @param {*} obj The object to test.
     * @return {boolean} Is the object an Array.
     */
    isArray: function(obj) {
      return toString.call(obj) === '[object Array]';
    },

    /**
     * Tests whether 'obj' is an Object
     * Borrowed from Underscore
     *
     * @param {*} obj The object to test.
     * @return {boolean} Is the object an Object.
     */
    isObject: function(obj) {
      return obj === Object(obj);
    },

    /**
     * Tests whether 'obj' is a function
     * Borrowed from Underscore.
     *
     * @param {*} obj The object to test.
     * @return {boolean} Is the object a function.
     */
    isFunction: function(obj) {
      return typeof obj === 'function';
    },

    isBoolean: function(obj) {
      return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
    },

    isUndefined: function(obj) {
      return obj === void 0;
    },

    /**
     * Generate a unique integer id (unique within the entire client session).
     * Borrowed from Underscore
     *
     * @param {string=} prefix
     * @return {string} unique id.
     */
    uniqueId: function(prefix) {
      var id = ++idCounter + '';
      return prefix ? prefix + id : id;
    },

    /*  Copyright (C) 2012-2013  Kurt Milam - http://xioup.com | Source: https://gist.github.com/1868955
     *
     *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
     *  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
     *
     *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     **/

    // Based conceptually on the _.extend() function in underscore.js ( see http://documentcloud.github.com/underscore/#extend for more details )

    deepExtend: function(obj) {
      var parentRE = /#{\s*?_\s*?}/,
        slice = Array.prototype.slice,
        hasOwnProperty = Object.prototype.hasOwnProperty;

      _.each(slice.call(arguments, 1), function(source) {
        for (var prop in source) {
          if (hasOwnProperty.call(source, prop)) {
            if (_.isUndefined(obj[prop]) || _.isFunction(obj[prop]) || _.isNull(source[prop])) {
              obj[prop] = source[prop];
            }
            else if (_.isString(source[prop]) && parentRE.test(source[prop])) {
              if (_.isString(obj[prop])) {
                obj[prop] = source[prop].replace(parentRE, obj[prop]);
              }
            }
            else if (_.isArray(obj[prop]) || _.isArray(source[prop])) {
              if (!_.isArray(obj[prop]) || !_.isArray(source[prop])) {
                throw 'Error: Trying to combine an array with a non-array (' + prop + ')';
              } else {
                obj[prop] = _.reject(_.deepExtend(obj[prop], source[prop]), function(item) { return _.isNull(item);});
              }
            }
            else if (_.isObject(obj[prop]) || _.isObject(source[prop])) {
              if (!_.isObject(obj[prop]) || !_.isObject(source[prop])) {
                throw 'Error: Trying to combine an object with a non-object (' + prop + ')';
              } else {
                obj[prop] = _.deepExtend(obj[prop], source[prop]);
              }
            } else {
              obj[prop] = source[prop];
            }
          }
        }
      });
      return obj;
    }
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  // Borrowed from Underscore
  var types = ['Arguments', 'String', 'Number', 'Date', 'RegExp'];
  for (var i = 0; i < types.length; i++) {
    aeris.utils['is' + types[i]] = (function(j) {
      return function(obj) {
        return toString.call(obj) == '[object ' + types[j] + ']';
      }
    })(i);
  }

  // Return utils, mixed into underscore
  _.mixin(aeris.utils);
  return _;
});
