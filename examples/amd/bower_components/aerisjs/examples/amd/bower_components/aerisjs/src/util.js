define([
  'underscore'
], function(_) {

  /**
   * Aeris library utilities.
   *
   * @class util
   * @namespace aeris
   * @static
   */
  var util = {
    /**
     * Representation of an abstract method that needs overriding.
     * @method abstractMethod
     */
    abstractMethod: function() {
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
    }
  };

  // Mix utility methods into underscore
  _.mixin(util);

  return _;
});
