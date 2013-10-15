define([
  'aeris/util',
  'aeris/loader/loaderinterface',
  'aeris/promise'
], function(_, LoaderInterface, Promise) {
  /**
   * Abstract Loader
   *
   * @class aeris.loader.AbstractLoader
   * @extends aeris.loader.LoaderInterface
   * @abstract
   */
  var AbstractLoader = function() {
    /**
     * @type {Array} A list of paths to load.
     * @protected
     */
    this.paths_ = this.paths_ || [];

    LoaderInterface.apply(this, arguments);
  };
  _.inherits(AbstractLoader, LoaderInterface);


  /**
   * Load an array of paths.
   *
   * @protected
   *
   * @param {Array.<string>=} opt_paths
   *                         Array of RequireJS paths.
   *                         Defaults to this.paths_.
   * @return {aeris.Promise} A promise to load the requirement.
   *                         Resolves with an array of loaded modules.
   *                         Rejects with a RequireJS error object.
   */
  AbstractLoader.prototype.loadPaths_ = function(opt_paths) {
    var promise = new Promise();
    var paths = opt_paths || this.paths_;

    require(paths, function() {
      var modules = _.argsToArray(arguments);
      promise.resolve.apply(promise, modules);
    }, function(error) {
      promise.reject({
        code: error.requireType,
        message: 'Unable to load modules: ' + error.requireModules.join(', ')
      });
    });

    // Clean up stored paths
    this.resetPaths_();

    return promise;
  };


  /**
   * Adds paths to this.paths_.
   *
   * @param {string|Array.<string>} paths
   * @private
   */
  AbstractLoader.prototype.addPath_ = function(paths) {
    // Normalize paths as array
    _.isArray(paths) || (paths = [paths]);

    _.each(paths, function(pp) {
      this.paths_.push(pp.toLowerCase());
    }, this);
  };


  /**
   * Add paths at a specified base path.
   *
   * eg.
   *  addPathAt_('someModule', 'someNS')
   *  // adds the path 'someNS/someModule'
   *
   * @param {string|Array.<string>} paths
   * @param {string} loc Base path.
   * @private
   */
  AbstractLoader.prototype.addPathAt_ = function(paths, loc) {
    // Normalize paths as array
    _.isArray(paths) || (paths = [paths]);

    _.each(paths, function(pp) {
      this.addPath_(loc.toLowerCase() + '/' + pp.toLowerCase());
    }, this);
  };


  /**
   * Clears the current list of paths to load,
   * optionally replacing them with new paths.
   *
   * @param {string|Array.<string>=} opt_paths
   * @private
   */
  AbstractLoader.prototype.resetPaths_ = function(opt_paths) {
    this.paths_ = [];

    if (opt_paths) {
      this.addPath_(opt_paths);
    }
  };


  /**
   * Normalizes the config object
   * assed to aeris.loader.LoaderInterface#load.
   *
   * Does not alter the original object.
   *
   * @param {Object} config
   * @return {Object} Normalized config object.
   * @private
   */
  AbstractLoader.prototype.normalizeConfig_ = function(config) {
    return _.extend({
      onerror: function() {},
      onload: function() {}
    }, config);
  };

  return AbstractLoader;
});
