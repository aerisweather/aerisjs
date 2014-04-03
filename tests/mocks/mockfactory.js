define(['aeris/util'], function(_) {
  /**
   * @class MockFactory
   * @constructor
   *
   * @param {Object=} opt_options
   * @param {Array.<string>} opt_options.methods List of methods for which to create spies.
   * @param {Function=} opt_options.inherits Parent class.
   * @param {Function=} opt_options.constructor Constructor method.
   * @param {string=} opt_options.name Used for spec output.
   */
  var MockFactory = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      methods: [],
      constructor: function() {},
      name: 'Mock_Object'
    });

    var Mock = function() {
      if (options.inherits) {
        options.inherits.apply(this, arguments);
      }

      options.methods.forEach(function(methodName) {
        spyOn(this, methodName).andCallThrough();
      }, this);


      options.constructor.apply(this, arguments);

      this.mockName_ = options.name + '_' + (this.cid || _.uniqueId());
    };
    if (options.inherits) {
      _.inherits(Mock, options.inherits);
    }

    Mock.prototype.jasmineToString = function() {
      return this.mockName_;
    };

    options.methods.forEach(function(methodName) {
      Mock.prototype[methodName] = function() {};
    });


    return Mock;
  };


  return MockFactory;
});
