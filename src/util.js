define([
  'underscore'
], function(underscore) {
  var _ = underscore.noConflict();

  /**
   * Aeris library utilities.
   *
   * @class util
   * @namespace aeris
   * @static
   */
  var customUtil = {
    /**
     * Representation of an abstract method that needs overriding.
     * @method abstractMethod
     */
    abstractMethod: function() {
    },

    /**
     * Bind all methods in an object
     * to be run in the specified context.
     *
     * @param {Object} object
     * @param {Object=} opt_ctx Defaults to the object.
     */
    bindAllMethods: function(object, opt_ctx) {
      var ctx = opt_ctx || object;

      _.each(object, function(val, key) {
        if (_.isFunction(val)) {
          object[key] = val.bind(ctx);
        }
      });
    },


    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * @param {Function} ChildCtor Child class.
     * @param {Function} ParentCtor Parent class.
     * @method inherits
     */
    inherits: function(ChildCtor, ParentCtor) {
      function TempCtor() {
        this.__Parent = ParentCtor;
      }

      TempCtor.prototype = ParentCtor.prototype;
      ChildCtor.prototype = new TempCtor();
      ChildCtor.prototype.constructor = ChildCtor;
    },


    /**
     * Expose a variable at the provided path under the
     * global namespace.
     *
     * Eg.
     *  _.expose(MyClass, 'aeris.someSubNs.MyClass');
     *  aeris.someSubNs.MyClass === MyClass     // true
     *
     * @param {*} obj The variable to expose.
     * @param {string} path Path that should be available.
     * @method expose
     */
    expose: function(obj, path) {
      var parts = path.split('.');
      var partsLength = parts.length;
      var ns = window;

      _.each(parts, function(part, i) {
        var isLastRef = i === (partsLength - 1);
        var nsValue = ns[part] || {};

        ns[part] = isLastRef ? obj : nsValue;

        // Move up our namespace pointer
        ns = ns[part];
      }, this);

      return obj;
    },


    /**
     * Ensures the defined path is available base on dot namespace.
     *
     * @param {string} path Path that should be available.
     * @return {undefined}
     * @method provide
     */
    provide: function(path) {
      return this.expose({}, path, false);
    },


    /**
     * Returns the average of an array
     * of numbers.
     *
     * @param {Array.<number>} arr
     * @method average
     */
    average: function(arr) {
      var numbers = _.isArray(arr) ? arr : util.argsToArray(arguments);
      var sum = numbers.reduce(function(sum, num) {
        return sum + num;
      }, 0);

      return sum / numbers.length;
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
     * @method interval
     */
    interval: function(fn, wait, opt_ctx, var_args) {
      var args = Array.prototype.slice.call(arguments, 3);
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
     * @method argsToArray
     */
    argsToArray: function(args) {
      return Array.prototype.slice.call(args, 0);
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
     * @method path
     */
    path: function(pathStr, opt_scope) {
      var parts, scope;

      if (!_.isString(pathStr) || !pathStr.length) {
        return undefined;
      }

      parts = pathStr.split('.');

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
     * @method isNumeric
     */
    isNumeric: function(obj) {
      return !_.isObject(obj) && !isNaN(parseFloat(obj)) && isFinite(obj);
    },


    /**
     * @param {Number} n
     * @return {Boolean}
     * @method isInteger
     */
    isInteger: function(n) {
      return _.isNumeric(n) && (n % 1 === 0);
    },


    isPlainObject: function(obj) {
      var isPlain = !_.isFunction(obj) && !_.isArray(obj);
      return _.isObject(obj) && isPlain;
    },


    /**
     * Throw an 'uncatchable' error.
     *
     * The error is 'uncatchable' because it is thrown
     * after the current call stack completes. This is generally
     * a bad idea, though it can be useful for forcing errors
     * to be thrown in promise callbacks.
     *
     * @param {Error} e
     * @method throwUncatchable
     */
    throwUncatchable: function(e) {
      _.defer(function() {
        throw e;
      });
    },


    /**
     * Throw an error.
     *
     * @param {Error} err
     */
    throwError: function(err) {
      throw err;
    },


    template: function() {
      // Temporarily change templateSettings
      // so we don't overwrite global settings
      // for other users.
      var res;
      var settings_orig = _.clone(_.templateSettings);
      _.templateSettings.interpolate = /\{(.+?)\}/g;

      res = _.template.apply(_, arguments);

      // Restore original settings
      _.templateSettings = settings_orig;

      return res;
    },

    /**
     * Invokes a callback with each object in an array.
     * Waits `interval` ms between each invocation.
     *
     * @param {Array} objects
     * @param {Function} cb
     * @param {Number} interval
     */
    eachAtInterval: function(objects, cb, interval) {
      var next = function(i) {
        var obj = objects[i];
        var nextIncremented = _.partial(next, i + 1);

        if (obj) {
          cb(obj);
          _.delay(nextIncremented, interval);
        }
      };

      next(0);
    },

    /**
     * @method tryCatch
     * @param {function()} tryFn
     * @param {function(Error)} catchFn
     */
    tryCatch: function(tryFn, catchFn) {
      try {
        tryFn();
      }
      catch (err) {
        catchFn(err);
      }
    }
  };


  // Instead of mixing our methods into underscore (which
  // would overwrite the client's window._ object), we
  // are creating a clone of underscore.
  //
  // Create a proxy _() wrapper function
  var util = function(var_args) {
    // Call the underscore wrapper with supplied
    // arguments
    var wrapper = _.apply(_, arguments);

    // Mixin custom functions
    _.each(customUtil, function(func, name) {
      wrapper[name] = function() {
        return func.call(wrapper, wrapper._wrapped);
      };
    });
    wrapper.mixin(customUtil);

    return wrapper;
  };
  _.extend(util, _, customUtil);


  return util;
});
