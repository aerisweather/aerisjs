define([
  'aeris/util',
  'mocks/mockfactory',
  'aeris/model',
  'aeris/promise',
  'aeris/errors/apiresponseerror'
], function(_, MockFactory, Model, Promise, ApiResponseError) {
  /**
   * @class MockAerisApiModel
   * @extends aeris.Model
   */
  var MockAerisApiModel = MockFactory({
    methods: [
      'fetch'
    ],
    inherits: Model,
    constructor: function(opt_attrs, opt_options) {
      var options = opt_options || {};
      this.params_ = new Model(options.params);
    }
  });

  /**
   * @method setParams
   * @param {Object} params
   */
  MockAerisApiModel.prototype.setParams = function(params) {
    this.params_.set(params);
  };

  /**
   * @method getParams
   * @return {Object}
   */
  MockAerisApiModel.prototype.getParams = function() {
    return this.params_;
  };

  /**
   * @method fetch
   * @return {aeris.Promise}
   */
  MockAerisApiModel.prototype.fetch = function() {
    return this.promise_ = new Promise();
  };

  /**
   * Resolves the promise return by apiModel#fetch
   *
   * @method andResolveWith
   * @param {Object} response
   */
  MockAerisApiModel.prototype.andResolveWith = function(response) {
    if (!this.promise_) {
      throw new Error('fetch has not yet been called');
    }

    this.promise_.resolve(response);
  };

  /**
   * Rejects the promise return by apiModel#fetch
   *
   * @method andRejectWith
   * @param {Object} obj
   * @param {string=} obj.code
   * @param {string=} obj.message
   * @param {Object=} obj.responseObject
   */
  MockAerisApiModel.prototype.andRejectWith = function(obj) {
    var error;

    if (!this.promise_) {
      throw new Error('fetch has not yet been called');
    }

    error = new ApiResponseError();
    _.extend(error, _.defaults(obj, {
      code: 'STUB_CODE',
      message: 'STUB_MESSAGE',
      responseObject: {}
    }));

    this.promise_.reject(error);
  };

  return MockAerisApiModel;
});
