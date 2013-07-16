define(['aeris'], function(aeris) {

  /**
   * @fileoverview Provides various utility methods.
   */

  aeris.provide('aeris.utils');

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
    }
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  // Borrowed from Underscore
  var types = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'];
  for (var i = 0; i < types.length; i++) {
    aeris.utils['is' + types[i]] = (function(j) {
      return function(obj) {
        return toString.call(obj) == '[object ' + types[j] + ']';
      }
    })(i);
  }

  return aeris.utils;
});
