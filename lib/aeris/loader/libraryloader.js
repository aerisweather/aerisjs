define([
  'aeris/util',
  'aeris/promise',
  'loader/abstractloader'
], function(_, Promise, AbstractLoader) {
  /**
   * A central loader for loading and
   * configuring other loaders.
   *
   * @class aeris.loader.LibraryLoader
   * @extends aeris.loader.AbstractLoader
   * @implements aeris.loader.LoaderInterface
   *
   * @constructor
   */
  var LibraryLoader = function() {
    AbstractLoader.apply(this, arguments);
  };
  _.inherits(LibraryLoader, AbstractLoader);


  /** @override */
  LibraryLoader.prototype.load = function(config) {
    var libraryLoaderConfigs;
    var promiseToLoadAllLibraries;

    this.setConfig_(config);
    libraryLoaderConfigs = this.getLibraryLoaderConfigs_();
    promiseToLoadAllLibraries = this.loadLibraries_(libraryLoaderConfigs);

    this.bindLoadCallbacksToPromise_(promiseToLoadAllLibraries);

    return promiseToLoadAllLibraries;
  };


  /**
   * @private
   * @returns {Object}
   */
  LibraryLoader.prototype.getLibraryLoaderConfigs_ = function() {
    var configKeysWhichAreNotLoaderIds = _.keys(this.getDefaultConfig_());

    return _.omit(this.config_, configKeysWhichAreNotLoaderIds);
  };


  /**
   * Load a set of library loader scripts,
   * and run each of them with the associated configuration object.
   *
   * @param {Object} loaderConfigs
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
  LibraryLoader.prototype.loadLibraries_ = function(loaderConfigs) {
    var childrenLoaderPromises = _.map(loaderConfigs, this.loadSingleLibrary_, this);

    return Promise.when(childrenLoaderPromises);
  };


  /**
   * @param {Object} loaderConfig
   * @param {string} libraryId
   * @return {aeris.Promise}
   * @private
   */
  LibraryLoader.prototype.loadSingleLibrary_ = function(loaderConfig, libraryId) {
    var promiseToLoadChild = new Promise();

    this.require([this.getLoaderIdForLibrary_(libraryId)]).
      done(function(LibraryLoader) {
        new LibraryLoader().load(loaderConfig).
          done(promiseToLoadChild.resolve, promiseToLoadChild).
          fail(promiseToLoadChild.reject, promiseToLoadChild);
      }).
      fail(this.handleError_, this);

    return promiseToLoadChild;
  };


  LibraryLoader.prototype.getLoaderIdForLibrary_ = function(libraryId) {
    return libraryId + '/loader';
  };


  return LibraryLoader;
});
