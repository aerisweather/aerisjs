define([
  'aeris/util',
  'aeris/errors/invalidargumenterror'
], function(_, InvalidArgumentError) {
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


  MockRequire.prototype.unssetModule = function(moduleId) {
    if (!this.definedModules_[moduleId]) {
      throw new InvalidArgumentError(moduleId + 'cannot be unsset: it was never defined.');
    }

    delete this.definedModules_[moduleId];
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
    var notFoundModules;
    var foundModules;
    var callback = opt_callback || NOOP;
    var errback = opt_errback || NOOP;
    var delay = this.requireDelay_;

    // Using `require('moduleName')`
    // returns the defined module
    if (_.isString(requestedModuleIds)) {
      var ModuleFactory = this.definedModules_[requestedModuleIds];
      if (!ModuleFactory) {
        throw new Error('Module "' + requestedModuleIds + '" has not yet been loaded.');
      }
      return ModuleFactory();
    }

    foundModules = this.resolveModulesById_(requestedModuleIds);
    notFoundModules = this.getUndefinedModuleIds_(requestedModuleIds);

    if (notFoundModules.length) {
      this.invokeErrback_(errback, notFoundModules, delay);
      return;
    }

    this.invokeCallback_(callback, foundModules, delay);
  };


  /**
   * @return {Array.<string>}
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


  MockRequire.prototype.invokeCallback_ = function(callback, resolvedModules, delay) {
    this.invokeAfterDelay_(function() {
      callback.apply(global, resolvedModules);
    }, delay);
  };


  MockRequire.prototype.invokeErrback_ = function(errback, missingModuleIds, delay) {
    var errorObj = {
      requireType: 'No mock modules defined',
      requireModules: missingModuleIds
    };
    errback = _.bind(errback, global, errorObj);

    this.invokeAfterDelay_(errback, delay);
  };


  MockRequire.prototype.invokeAfterDelay_ = function(fn, delay) {
    if (_.isNull(delay)) {
      fn();
    }
    else {
      window.setTimeout(fn, delay);
    }
  };


  MockRequire.prototype.setRequireDelay = function(delayMilleseconds) {
    this.requireDelay_ = delayMilleseconds;
  };


  MockRequire.prototype.shouldHaveRequired = function(var_expectedIds) {
    var expectedIds = _.argsToArray(arguments);
    var actualRequiredIds = this.require.argsForCall.reduce(function(runningValue, callArgs) {
      Array.prototype.push.apply(runningValue, callArgs[0]);
      return runningValue;
    }, []);
    var notRequiredIds = _.difference(expectedIds, actualRequiredIds);

    expect(notRequiredIds).toEqual([]);
  };


  MockRequire.prototype.getRequiredModuleIds = function() {
    return this.require.
      argsForCall.
      reduce(function(moduleIds, requireArgs) {
        var requiredModulesIds = requireArgs[0];

        // Looking at a require('moduleName') call,
        // so this module hasn't necessary been loaded (just referenced).
        if (_.isString(requiredModulesIds)) {
          return moduleIds;
        }

        requiredModulesIds.forEach(moduleIds.push, moduleIds);

        return moduleIds;
      }, []);
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
    global.require = this.requireOrig_;
    global.define = this.defineOrig_;
  };

  if (jasmine) {
    beforeEach(function() {
      this.addMatchers({
        toHaveRequired: function(moduleId) {
          var mockRequire = this.actual;
          var actualRequiredModuleIds = mockRequire.getRequiredModuleIds();

          this.message = this.isNot ?
            _.constant('Expected MockRequire not to have required ' +
              'module "' + moduleId + '"') :
            _.constant('Expected MockRequire to have required ' +
              'module "' + moduleId + '". Actual required modules: ' +
              jasmine.pp(actualRequiredModuleIds));

          return _.contains(actualRequiredModuleIds, moduleId);
        }
      });
    });
  }


  function NOOP() {}


  return MockRequire;
});
