define([
  'aeris/util',
  'loader/promise/promisetorequire'
], function(_, PromiseToRequire) {
  /**
   * Abstract Loader
   *
   * @class aeris.loader.AbstractLoader
   * @implements aeris.loader.LoaderInterface
   *
   * @abstract
   */
  var AbstractLoader = function() {
    /**
     * Configuration object used to
     * as instructions for the loader.
     *
     * @type {Object}
     * @private
     */
    this.config_ = {};
  };


  /** @override */
  AbstractLoader.prototype.load = _.abstractMethod;


  /**
   * @protected
   *
   * @param {Array.<string>=} paths AMD module ids.
   * @return {aeris.loader.promise.PromiseToRequire}
   */
  AbstractLoader.prototype.require = function(paths) {
    var promise = new PromiseToRequire();

    require(paths, promise.resolve, promise.reject);

    return promise;
  };


  AbstractLoader.prototype.setConfig_ = function(config) {
    this.config_ = this.normalizeConfig_(config);
  };


  /**
   * @private
   *
   * @param {Object} config
   * @return {Object} Normalized config object.
   */
  AbstractLoader.prototype.normalizeConfig_ = function(config) {
    return _.defaults(config, this.getDefaultConfig_());
  };


  /**
   * @returns {AbstractLoader.DEFAULT_CONFIG_}
   * @private
   */
  AbstractLoader.prototype.getDefaultConfig_ = function() {
    return _.clone(AbstractLoader.DEFAULT_CONFIG_);
  };


  /**
   * @param {aeris.Promise} promise
   * @private
   */
  AbstractLoader.prototype.bindLoadCallbacksToPromise_ = function(promise) {
    promise.
      done(this.config_.onload).
      fail(this.config_.onerror);
  };


  /** @private */
  AbstractLoader.prototype.handleError_ = function(err) {
    this.config_.onerror(err);
  };


  /**
   * @protected
   * @static
   * @type {Object}
   */
  AbstractLoader.DEFAULT_CONFIG_ = {
    onerror: function() {},
    onload: function() {}
  };


  return AbstractLoader;
});
