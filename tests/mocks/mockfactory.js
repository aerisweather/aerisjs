define(['aeris/util'], function(_) {
  /**
   * @class MockFactory
   * @constructor
   *
   * @param {Object=} opt_options
   * @param {Array.<string>} opt_options.methods List of methods for which to create spies.
   * @param {Array.<string>} opt_options.getSetters List of attributes for which to create
   *        getter and setter spies (Model types only).
   * @param {Function=} opt_options.inherits Parent class.
   * @param {Function=} opt_options.constructor Constructor method.
   * @param {string=} opt_options.name Used for spec output.
   */
  var MockFactory = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      methods: [],
      getSetters: [],
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

      options.getSetters.forEach(function(attr) {
        spyOn(this, 'set' + capitalize(attr)).andCallThrough();
        spyOn(this, 'get' + capitalize(attr)).andCallThrough();
      }, this);


      options.constructor.apply(this, arguments);

      this.mockName_ = options.name + '_' + (this.cid || _.uniqueId());

      this.ctorArgs = _.argsToArray(arguments);
    };
    if (options.inherits) {
      _.inherits(Mock, options.inherits);
    }

    Mock.prototype.jasmineToString = function() {
      return this.mockName_;
    };


    /**
     * Sets name used in jasmineToString.
     * eg:
     *  var myMock = new SomeMock().withName('myMock');
     *
     * @param {String} name
     * @returns {MockFactory}
     * @chainable
     */
    Mock.prototype.withName = function(name) {
      this.mockName_ = name;
      return this;
    };


    options.methods.forEach(function(methodName) {
      Mock.prototype[methodName] = function() {};
    });


    options.getSetters.forEach(function(attr) {
      Mock.prototype['set' + capitalize(attr)] = function(val) {
        this.set(attr, val);
      };

      Mock.prototype['get' + capitalize(attr)] = function() {
        return this.get(attr);
      };
    });


    return Mock;
  };


  return MockFactory;


  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});
