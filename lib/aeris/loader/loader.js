define([
  'aeris/util',
  'aeris/promise',
  'aeris/loader/abstractloader'
], function(_, Promise, AbstractLoader) {
  /**
   * A central loader for all aeris libs.
   *
   * @class aeris.loader.Loader
   * @extends aeris.loader.AbstractLoader
   *
   * @constructor
   */
  var Loader = function() {
    AbstractLoader.apply(this, arguments);
  };
  _.inherits(Loader, AbstractLoader);


  Loader.prototype.load = function(config) {
    config = this.normalizeConfig_(config);
    loaders = _.omit(config, 'onload', 'onerror');

    return this.loadLibLoaders_(loaders).
      done(config.onload, null).
      fail(config.onerror, null);
  };


  /**
   * Load a set of library loader scripts,
   * and run each of them with the associated configuration object.
   *
   * @param {Object} libLoaders
   *        For example:
   *          {
   *            maps: {
   *              packages: ['layers', 'markers']
   *            },
   *            api: {
   *              endpoints: ['fire', 'stormreports'],
   *              onload: function() {
   *                console.log('yeah!');
   *              }
   *            }
   *          }.
   * @return {aeris.Promise} A promise to load all loaders.
   * @private
   */
  Loader.prototype.loadLibLoaders_ = function(libLoaders) {
    var configs = [];
    var masterPromise = new Promise();
    var subPromises = [];

    // Add loader paths
    _.each(libLoaders, function(loaderConfig, loaderLib) {
      this.addPathAt_('loader', 'aeris/' + loaderLib);

      // Save an ordered list of loader config objects
      // So we can use them once the loaders are loaded
      configs.push(loaderConfig);
    }, this);

    // Load the loader modules
    this.loadPaths_().done(function(var_loaders) {
      var loaders = _.argsToArray(arguments);

      // Run each Loader#load
      _.each(loaders, function(LibLoader, n) {
        var loaderConfig = configs[n];
        var libLoader = new LibLoader();

        subPromises.push(libLoader.load(loaderConfig));
      }, this);

      // Resolve master, when sub have completed
      Promise.when(subPromises).
        done(masterPromise.resolve, masterPromise).
        fail(masterPromise.reject, masterPromise);
    }, this);

    return masterPromise;
  };


  return Loader;
});
