define([
  'aeris/util'
], function(_) {
  /**
   * A Factory for creating Class constructors.
   *
   * Allows for "soft" binding arguments to the Class
   * constructor; bound arguments will serve as the default
   * constructor arguments, but any arguments passed in on
   * instantiation will override the bound arguments.
   *
   * For example:
   *   var Klass = new ClassFactory(ParentKlass, ['a', 'b', 'c']);
   *   new Klass('x');    // ParentKlass ctor called with ('x', 'b', 'c')
   *
   * This can be useful for wiring up Classes which are simply
   * configured versions of a parent class. For example,
   *
   *    var DefaultSelectedModel = new ClassFactory(aeris.Model, { selected: true });
   *    var model = new DefaultSelectedModel();
   *
   *    model.get('selected')     // true
   *
   *    // Argument binding is "soft"
   *    var notSelectedModel = new DefaultSelectedModel({ selected: false });
   *    notSelectedModel.get('selected')    // false
   *
   *
   * Use the extendArgObjects option to
   * extend instance argument objects.
   *
   * For example:
   *
   *    var SomeModelClass = new ClassFactory(Model, [{ foo: 'bar', hello: 'World' }], { extendArgObjects: ... }];
   *
   *    var model = new SomeModelClass({ hello: 'Universe' });
   *
   *    // with extendArgObjects: true
   *    // called attrs extend the bound attrs
   *    model.toJSON() === { foo: 'bar', hello: 'Universe' });
   *
   *    // with extendArgObjects: false
   *    // called attrs replace the bound attrs
   *    model.toJSON === { hello: 'Universe' }
   *
   *
   * @class ClassFactory
   * @namespace aeris
   *
   * @param {Function=} opt_Type Parent class constructor.
   * @param {Array.<*>} opt_boundArgs Arguments to bind to the class constructor.
   *
   * @param {Object=} opt_options
   * @param {Boolean=} extendArgObjects Defaults to false. See {aeris.ClassFactory} documentation for details.
   *
   * @return {Function} Class constructor.
   *
   * @constructor
   */
  var ClassFactory = function(opt_Type, opt_boundArgs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      /**
       * If set to true,
       * Class arguments which are objects
       * will be extend the corresponding
       * bound argument, instead of overriding it.
       *
       * For example:
       *
       * var SomeModelClass = new ClassFactory(Model, [{ foo: 'bar', hello: 'World' }], { extendArgObjects: ... }];
       *
       * var model = new SomeModelClass({ hello: 'Universe' });
       *
       * // with extendArgObjects: true
       * // called attrs extend the bound attrs
       * model.toJSON() === { foo: 'bar', hello: 'Universe' });
       *
       * // with extendArgObjects: false
       * // called attrs replace the bound attrs
       * model.toJSON === { hello: 'Universe' }
       */
      extendArgObjects: false
    });

    var boundArgs = opt_boundArgs || [];

    // Define class constructor
    var Klass = function(var_args) {
      var args = _.argsToArray(arguments);

      _.each(boundArgs, function(bArg, n) {
        // Class is not called with argument
        // at this index
        // --> set to bound argument
        if (_.isUndefined(args[n])) {
          // Set to bound argument
          args[n] = bArg;
        }
        else if (_.isObject(args[n]) && _.isObject(bArg) && options.extendArgObjects) {
          // Extend the bound argument
          args[n] = _.defaults(args[n], bArg);
       }

        // Otherwise,
        // if instance argument exists,
        // ignore bound argument.
      });

      // Call constructor
      if (opt_Type) {
        opt_Type.apply(this, args);
      }
    };

    // Inherit from opt_Type
    if (opt_Type) {
      _.inherits(Klass, opt_Type);
    }

    return Klass;
  };


  return ClassFactory;
});
