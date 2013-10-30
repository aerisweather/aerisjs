define([
  'vendor/underscore'
], function(_) {

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


  /**
   * Value identifying a non-implemented feature.
   *
   * @type {string}
   */
  var NOT_IMPLEMENTED = 'NOT_IMPLEMENTED';

  /**
   * A workaround for using apply on console.log.
   * http://stackoverflow.com/questions/5538972/console-log-apply-not-working-in-ie9
   * Use log_.apply(window.console, [...])
   *
   * @const
   */
  var log_ = Function.prototype.bind.call(window.console.log, window.console);

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
  var util = {
    /**
     * Use for abstract-like / interface-like definitions of a method or class
     * that may or many not be required for implementation. Used for feature
     * detection.
     */
    notImplemented: function(feature, description) {
      return NOT_IMPLEMENTED;
    },


    /**
     * Determine if a feature is provided.
     *
     * @param {string} feature
     * @return {boolean}
     */
    can: function(feature) {
      var pass = true;
      var featSplit = feature.split('.');
      var context = aeris;
      var length = featSplit.length;
      for (var fi in featSplit) {
        var feat = featSplit[fi];
        if (context[feat]) {
          context = context[feat];
        } else if (parseInt(fi) + 1 == length && context.prototype) {
          context = context.prototype[feat];
        } else {
          context = undefined;
        }
        if (context == NOT_IMPLEMENTED || typeof context === 'undefined') {
          pass = false;
          break;
        }
      }
      return pass;
    },


    /**
     * Console support for logging of javascript properties and aeris features.
     *
     * @const
     */
    console: {

      /**
       * Enabled state of aeris.console methods.
       *
       * @type {boolean}
       */
      enabled: true,


      /**
       * Log to appropriate tool dependeing on browser and enabled state.
       *
       * @param {...*} var_args A variable number of arguments to log.
       * @return {undefined}
       */
      log: function() {
        if (!this.console.enabled)
          return false;
        if (window && window.console && window.console.log) {
          log_.apply(window.console, arguments);
        }
      },


      /**
       * Log a pretty output of a given feature.
       *
       * @param {string} feature
       * @return {undefined}
       */
      can: function(feature) {
        this.console.log(
          'Can ' + feature + '? ',
          this.can(feature) ? 'Yes' : 'No'
        );
      }
    },


    /**
     * Uppercase the first letter in a string.
     *
     * @param {string} string
     * @return {string}
     */
    ucfirst: function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },


    /**
     * Representation of an abstract method that needs overriding.
     */
    abstractMethod: function() {},


    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * @param {Function} ChildCtor Child class.
     * @param {Function} ParentCtor Parent class.
     */
    inherits: function(ChildCtor, ParentCtor) {
      function TempCtor() {};
      TempCtor.prototype = ParentCtor.prototype;
      ChildCtor.prototype = new TempCtor();
      ChildCtor.prototype.constructor = ChildCtor;
    },

    /**
     * Expose a variable at the provided path under the
     * global aeris namespace.
     *
     * Eg.
     *  _.expose(MyClass, 'aeris.someSubNs.MyClass');
     *  aeris.someSubNs.MyClass === MyClass     // true
     *
     * @param {*} obj The variable to expose.
     * @param {string} path Path that should be available.
     * @param {Boolean=} opt_overwrite Whether to overwrite the object,
     *                                if it already exists.
     */
    expose: function(obj, path, opt_overwrite) {
      var parts = path.split('.');
      var partsLength = parts.length;
      var overwrite = _.isUndefined(opt_overwrite) ? true : opt_overwrite;
      var ns;

      window.aeris || (window.aeris = {});
      ns = window.aeris;

      for (var i = 1; i <= partsLength; i++) {
        var part = parts[i];

        // create empty namespace
        if (_.isUndefined(ns[part])) {
          ns[part] = {};
        }
        // Assign last property to variable
        if (i === (partsLength - 1) && overwrite) {
          ns[part] = obj;
        }

        // Move up our namespace pointer
        ns = ns[part];
      }

      return obj;
    },


    /**
     * Ensures the defined path is available base on dot namespace.
     *
     * @param {string} path Path that should be available.
     * @return {undefined}
     */
    provide: function(path) {
      return this.expose({}, path, false);
    },

    /**
     *  deepExtend method is
     *  Copyright (C) 2012-2013  Kurt Milam - http://xioup.com | Source: https://gist.github.com/1868955
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
    },

    /**
     * Converts a decimal coordinate
     * to degrees.
     *
     * eg. 45.1234567 --> [45, 7, 24.4452]
     *
     * @param {number} decimal
     * @return {Array.<number>} as [degrees, seconds, minutes].
     */
    decimalToDegrees: function(decimal) {
      var sign = decimal >= 0 ? 1 : -1;
      var deg, min, sec;

      deg = Math.abs(decimal);
      min = (deg - Math.floor(deg)) * 60;
      sec = (min - Math.floor(min)) * 60;

      return [
        Math.floor(deg) * sign,
        Math.floor(min),
        sec
      ];
    },


    /**
     * Converts an array of [degrees, minutes, seconds]
     * to a decimal coordinate.
     *
     * eg. [45, 7, 24.4452] --> 45.1234567
     *
     * @param {Array.<number>} degrees as [degrees, minutes, seconds].
     * @return {number}
     */
    degreesToDecimal: function(degrees) {
      var sign = degrees[0] >= 0 ? 1 : -1;

      var dec = Math.abs(degrees[0]);
      dec += degrees[1] / 60;
      dec += (degrees[2] / 60) / 60;

      return dec * sign;
    },


    /**
     * Converts a latLon coordinate to degrees, minutes, and seconds.
     *
     * eg.  [45.1234567, -90.1234567]
     * --> [[45, 7, 24.4452], [-90, 7, 24.4452]]
     *
     * @param {Array.<number>} latLon
     * @return {Array.<Array.<number>>} Array of North and West coordinates
     *                                  as [degrees, minutes, seconds].
     */
    latLonToDegrees: function(latLon) {
      return [
        this.decimalToDegrees(latLon[0]),
        this.decimalToDegrees(latLon[1])
      ];
    },


    /**
     * Converts a coordinate from degrees to decimal latLon.
     *
     * eg. [[45, 7, 24.4452], [-90, 7, 24.4452]]
     * --> [45.1234567, -90.1234567]
     *
     * @param {Array.<Array.<number>>} degrees
     *                                 Array of North and West coordinates
     *                                 as [degrees, minutes, seconds].
     * @return {Array.<number>} LatLon coordinates as decimals.
     */
    degreesToLatLon: function(degrees) {
      return [
        this.degreesToDecimal(degrees[0]),
        this.degreesToDecimal(degrees[1])
      ];
    },

    /**
     * Returns the average of an array
     * of numbers.
     *
     * @param {Array.<number>} arr
     */
    average: function(arr) {
      var sum = 0;
      var error = new Error('Average method requires an array of numbers');

      if (!_.isArray(arr)) {
        throw error;
      }

      _.each(arr, function(n) {
        if (!_.isNumber(n)) {
          throw error;
        }
        sum += n;
      });

      return sum / arr.length;
    },


    /**
     * Extends _.delay to allow for
     * an optional context.
     *
     * @param {Function} fn
     * @param {number} wait
     * @param {Object} opt_ctx
     * @param {*} var_args Arguments to pass to the function.
     */
    delay: function(fn, wait, opt_ctx, var_args) {
      args = Array.prototype.slice.call(arguments, 3);
      if (opt_ctx) {
        fn = _.bind.apply(_, [fn, opt_ctx].concat(args));
      }

      window.setTimeout(fn, wait);
    },

    /**
     * Similar to window.setInterval,
     * but allows for an optional context
     * and arguments to be passed to the function.
     *
     * @param {Function} fn
     * @param {number} wait
     * @param {Object} opt_ctx
     * @param {*} var_args Arguments to pass to the function.
     * @return {number} Reference to the interval, to be used with `clearInterval`.
     */
    interval: function(fn, wait, opt_ctx, var_args) {
      args = Array.prototype.slice.call(arguments, 3);
      if (opt_ctx) {
        fn = _.bind.apply(_, [fn, opt_ctx].concat(args));
      }

      return window.setInterval(fn, wait);
    },


    /**
     * Converts an arguments object to a true array.
     *
     * @param {Array} args object.
     * @return {Array}
     */
    argsToArray: function(args) {
      return Array.prototype.slice.call(args, 0);
    },


    /**
     * Converts a bounds object into
     * a polygon.
     *
     * @param {Array.<Array.<number>>} bounds
     * @return {Array.<number>}
     */
    boundsToPolygon: function(bounds) {
      //return bounds[0].concat(bounds[1]);
      var sw = bounds[0];
      var ne = bounds[1];
      var nw = [sw[0], ne[1]];
      var se = [ne[0], sw[1]];

      return [].concat(sw, nw, ne, se);
    },


    /**
     * Return a reference to a object property
     * from a dot-notated string.
     *
     * For example
     *  var obj = { foo: bar: { baz: 'in here!' } } }
     *  _.path('foo.bar.baz')    // 'in here!'
     *
     * Returns undefined if no reference exists.
     *
     * eg:
     *  _.path('foo.boo.goo.moo.yoo')  // undefined
     *
     * This can be useful for attempting to access object
     * properties, when you're not sure if the entire object
     * is defined.
     *
     * @param {string} pathStr
     * @param {Object=} opt_scope
     *        The object within which to search for a reference.
     *        If no scope is defined, will search within the
     *        global scope (window).
     *
     * @return {*|undefined}
     */
    path: function(pathStr, opt_scope) {
      var parts = pathStr.split('.');

      // Default to global scope
      scope = _.isUndefined(opt_scope) ? window : opt_scope;

      return _.reduce(parts, function(obj, i) {
        return _.isUndefined(obj) ? undefined : obj[i];
      }, scope);
    },

    /**
     * A loose test for number-like objects.
     *
     * _.isNumeric(123)     // true
     * _.isNumeric('123')   // true
     * _.isNumeric('foo')   // false
     * _.isNumeric('10px')  // false
     * _.isNumberic('');    // false
     *
     * Thanks to this guy:
     * http://stackoverflow.com/a/1830844
     *
     * @param {*} obj
     * @return {Boolean}
     */
    isNumeric: function(obj) {
      return !_.isObject(obj) && !isNaN(parseFloat(obj)) && isFinite(obj);
    },

    /**
     * Returns true if the array contains
     * the specified value.
     *
     * @param {Array} arr
     * @param {*} value
     * @return {Boolean}
     */
    contains: function(arr, value) {
      return _(arr).indexOf(value) !== -1;
    },


    /**
     * Parse end-leaf values of deep nested objects,
     * replacing string'ed objects to their
     * primitive values.
     *
     * Useful for processing inputs that are serialized
     * only as strings (eg. forms, querystring routes).
     *
     * eg. {
     *     num: '18.5',
     *     arr: [
     *       'true',
     *       {
     *         obj: {
     *           boolFalse: 'false',
     *           nums: ['16.5', 82, '19.001']
     *         }
     *       }
     *     ],
     *     obj: {
     *       str: 'str',
     *       boolTrue: 'true',
     *       boolTrueReal: true,
     *       nums: {
     *         numsA: [22, '15'],
     *         numsB: [18, {
     *           num: '-96.15'
     *         }]
     *       }
     *     }
     *   }
     * becomes:
     * {
     *     num: 18.5,
     *     arr: [
     *       true,
     *       {
     *         obj: {
     *           boolFalse: false,
     *           nums: [16.5, 82, 19.001]
     *         }
     *       }
     *     ],
     *     obj: {
     *       str: 'str',
     *       boolTrue: true,
     *       boolTrueReal: true,
     *       nums: {
     *         numsA: [22, 15],
     *         numsB: [18, {
     *           num: -96.15
     *         }]
     *       }
     *     }
     *   }
     *
     * @param str
     * @returns {*}
     */
    parseObjectValues: function(str) {
      var arr, obj;

      if (_.isArray(str)) {
        arr = str.slice(0);
        // Parse all array values recursively
        return _.map(arr, this.parseObjectValues, this);
      }
      if (_.isObject(str)) {
        obj = _.clone(str);
        // Parse all object values recursively.
        _.each(str, function(val, key) {
          str[key] = this.parseObjectValues(val);
        }, this);
        return str;
      }

      if (str === 'NaN') { return NaN; }
      if (str === 'undefined') { return undefined; }
      if (str === 'null') { return null; }
      if (str === 'true') { return true; }
      if (str === 'false') { return false; }
      if (_.isNumeric(str)) { return parseFloat(str); }

      return str;
    }
  };

  // Mix utility methods into underscore
  _.mixin(util);

  return _;
});
