define(['ai/util'], function(_) {
  /**
   * @class MockFactory
   * @constructor
   *
   * @param {Object=} opt_options
   * @param {Array.<string>} opt_options.methods List of methods for which to create spies.
   * @param {Function=} opt_options.inherits Parent class.
   */
  var MockFactory = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      methods: []
    });

    var Mock = function() {
      if (options.inherits) {
        options.inherits.apply(this, arguments);
      }

      options.methods.forEach(function(methodName) {
        spyOn(this, methodName).andCallThrough();
      }, this);
    }
    if (options.inherits) {
      _.inherits(Mock, options.inherits);
    }

    options.methods.forEach(function(methodName) {
      Mock.prototype[methodName] = function() {};
    });

    return Mock;
  }


  return MockFactory;
})