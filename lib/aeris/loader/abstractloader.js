define([
  'aeris/promise',
  'aeris/errors/unimplementedmethoderror'
], function(Promise, UnimplementedMethodError) {
  /**
   * Abstract Loader
   *
   * @class aeris.AbstractLoader
   * @static
   * @abstract
   */
  var AbstractLoader = {};

  /**
   * Load scripts from a configuration object
   *
   * @static
   * @param {Object} config
   * @return {aeris.Promise} A promise to load scripts.
   */
  AbstractLoader.load = function(config) {
    throw new UnimplementedMethodError('Loader class must implement a load method');
  };

  /**
   * Load a collection of requirements
   *
   * @param {Array.<string>} reqs Array of RequireJS paths.
   * @static
   * @protected
   * @return {aeris.Promise} A promise to load the requirement.
   */
  AbstractLoader.loadReqs_ = function(reqs) {
    var promise = new Promise();

    require(reqs, function() {
      promise.resolve();
    });

    return promise;
  };

  return AbstractLoader;
});
