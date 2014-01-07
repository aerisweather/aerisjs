define([
  'aeris/util'
], function(_) {
  var global = this;

  /**
   * @class MockRequire
   * @constructor
   */
  var MockRequire = function() {
    /**
     * @type {Function}
     * @private
     */
    this.requireOrig_ = global.require;

    /**
     * @type {Function}
     * @private
     */
    this.defineOrig_ = global.define;

    /**
     * Module id --> Module factory hash.
     *
     * @type {Object.<string,Function>}
     * @private
     */
    this.definedModules_ = {};

    /**
     * Milleseconds to wait before resolving
     * calls to require. Useful for mocking
     * asynchronous behavior.
     *
     * @type {?number}
     * @private
     */
    this.requireDelay_ = null;

    spyOn(this, 'require').andCallThrough();
  };


  /**
   * Note that the expected parameters are more
   * rigid than for RequireJs.
   *
   * @param {string} moduleId
   * @param {Function} moduleFactory
   */
  MockRequire.prototype.define = function(moduleId, moduleFactory) {
    this.definedModules_[moduleId] = moduleFactory;
  };


  /**
   * Note that the expected parameters are more
   * rigid than for RequireJs. (eg. CommonJS format not accepted).
   *
   * @param {Array.<string>} requestedModuleIds
   * @param {Function=} opt_callback
   * @param {Function=} opt_errback
   * @private
   */
  MockRequire.prototype.require = function(requestedModuleIds, opt_callback, opt_errback) {
    var callback = opt_callback || NOOP;
    var errback = opt_errback || NOOP;

    var foundModules = this.resolveModulesById_(requestedModuleIds);
    var notFoundModules = this.getUndefinedModuleIds_(requestedModuleIds);

    if (notFoundModules.length) {
      this.invokeErrback_(errback, notFoundModules);
      return;
    }

    this.invokeCallback_(callback, foundModules);
  };


  /**
   * @returns {Array.<string>}
   * @private
   */
  MockRequire.prototype.getDefinedModuleIds_ = function() {
    return _.keys(this.definedModules_);
  };


  MockRequire.prototype.getUndefinedModuleIds_ = function(requestedModuleIds) {
    return _.difference(requestedModuleIds, this.getDefinedModuleIds_());
  };


  /**
   * @param {Array.<string>} idList
   * @return {*} Resolved modules.
   * @private
   */
  MockRequire.prototype.resolveModulesById_ = function(idList) {
    var pickValues = _.compose(_.values, _.pick);
    var moduleFactories = pickValues(this.definedModules_, idList);
    var resolvedModules = _.map(moduleFactories, function(factory) {
      return factory();
    });

    return resolvedModules;
  };


  MockRequire.prototype.invokeCallback_ = function(callback, resolvedModules) {
    var boundCallback = function() {
      callback.apply(global, resolvedModules);
    };

    this.invokeAfterDelay_(boundCallback);
  };


  MockRequire.prototype.invokeErrback_ = function(errback, missingModuleIds) {
    var errorObj = {
      requireType: 'No mock modules defined',
      requireModules: missingModuleIds
    };
    errback = _.bind(errback, global, errorObj);

    this.invokeAfterDelay_(errback);
  };


  MockRequire.prototype.invokeAfterDelay_ = function(fn) {
    if (_.isNull(this.requireDelay_)) {
      fn();
    }
    else {
      window.setTimeout(fn, this.requireDelay_);
    }
  };


  MockRequire.prototype.setRequireDelay = function(delayMilleseconds) {
    this.requireDelay_ = delayMilleseconds;
  };


  MockRequire.prototype.shouldHaveBeenCalledWith = function(var_moduleIds) {
    var expectRequire = expect(this.require);
    var moduleIds = _.argsToArray(arguments);

    expectRequire.toHaveBeenCalled();
    expectRequire.toHaveBeenCalledWith.apply(expectRequire, moduleIds);
  };


  /**
   * Use MockRequire in place of the global
   * `require` method.
   */
  MockRequire.prototype.useMockRequire = function() {
    global.require = _.bind(this.require, this);
  };


  MockRequire.prototype.useMockDefine = function() {
    global.define = _.bind(this.define, this);
  };


  /**
   * Restore the original require object.
   */
  MockRequire.prototype.restore = function() {
    global.require =  this.requireOrig_;
    global.define = this.defineOrig_;
  };


  /**
   * Restore the original require object.
   */
  MockRequire.prototype.restore = function() {
    global.require =  this.requireOrig_;
  };


  function NOOP() {}


  return MockRequire;
});
