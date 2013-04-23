define(function (require) {

  /**
   * @fileoverview Bootstrap for the Aeris JS Map Library.
   *
   * Provides the aeris namespace and application-wide utilities. It is
   * assumed that all application files will require this file and possibly
   * extend the aeris namespace.
   */


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
   * Initialization of the aeris namespace and application-wide utility
   * methods.
   *
   * @const
   */
  var aeris = {


    /**
     * Application specific configuration options passed in from RequireJS.
     *
     * @const
     */
    config: require('module').config(),


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
     * Extend a given object with all the properties in passed-in object(s).
     *
     * @param {Object} obj An object to extend
     * @param {...Object} var_args A variable number of objects to extend from
     * @return {Object} The given object after being extended
     */
    extend: function(obj, var_args) {
      for (var ei in arguments) {
        var ext = arguments[ei];
        if (!ext || ext === obj) continue;
        for (var prop in ext) {
          obj[prop] = ext[prop];
        }
      }
      return obj;
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
       * @param {...*} var_args A variable number of arguments to log
       * @return {undefined}
       */
      log: function() {
        if (!aeris.console.enabled)
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
        aeris.console.log(
          'Can ' + feature + '? ',
          aeris.can(feature) ? 'Yes' : 'No'
        );
      }
    },


    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * @param {Function} childCtor Child class.
     * @param {Function} parentCtor Parent class.
     */
    inherits: function(childCtor, parentCtor) {
      function tempCtor() {};
      tempCtor.prototype = parentCtor.prototype;
      childCtor.prototype = new tempCtor();
      childCtor.prototype.constructor = childCtor;
    },


    /**
     * Ensures the defined path is available base on dot namespace.
     *
     * @param {string} path Path that should be available.
     * @return {undefined}
     */
    provide: function(path) {
      var cur = aeris;
      var parts = path.split('.');

      var partsLength = parts.length;
      for (var i = 0; i < partsLength; i++) {
        var part = parts[i];
        if (part == 'aeris' && cur === aeris)
          continue;
        else if (cur[part] === undefined) {
          cur = cur[part] = {};
        } else {
          cur = cur[part];
        }
      }
    }

  };

  return aeris;
});
