define(['aeris'], function(aeris) {

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

  return aeris.utils;
});
