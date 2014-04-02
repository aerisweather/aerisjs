define(['aeris/util'], function(_) {
  /**
   * @class MockFactory
   * @constructor
   *
   * @param {Object=} opt_options
   * @param {Array.<string>} opt_options.methods List of methods for which to create spies.
   * @param {Function=} opt_options.inherits Parent class.
   * @param {Function=} opt_options.constructor Constructor method.
   */
  var MockFactory = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      methods: [],
      constructor: function() {}
    });

    var Mock = function() {
      if (options.inherits) {
        options.inherits.apply(this, arguments);
      }

      options.methods.forEach(function(methodName) {
        spyOn(this, methodName).andCallThrough();
      }, this);


      options.constructor.apply(this, arguments);
    };
    if (options.inherits) {
      _.inherits(Mock, options.inherits);
    }

    options.methods.forEach(function(methodName) {
      Mock.prototype[methodName] = function() {};
    });


    return Mock;
  };


  return MockFactory;
});
