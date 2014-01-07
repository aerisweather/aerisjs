define([
  'aeris/util',
  'aeris/promise',
  'loader/errors/amdloaderror'
], function(_, Promise, AmdLoadError) {
  /**
   * A promise to load AMD modules.
   *
   * Resolves with requested modules.
   * Rejects with an {aeris.loader.errors.AmdLoadError} object.
   *
   * @class aeris.loader.promise.PromiseToRequire
   * @extends aeris.Promise
   *
   * @constructor
   */
  var PromiseToRequire = function(moduleIds) {
    Promise.apply(this, arguments);

    _.bindAll(this, 'resolve', 'reject');
  };
  _.inherits(PromiseToRequire, Promise);


  /** @override */
  PromiseToRequire.prototype.resolve = function(var_modules) {
    var modules = _.argsToArray(arguments);
    return Promise.prototype.resolve.apply(this, modules);
  };


  /** @override */
  PromiseToRequire.prototype.reject = function(amdError) {
    var error = this.createRejectionError_(amdError);
    return Promise.prototype.reject.call(this, error);
  };


  /** @return {Error} */
  PromiseToRequire.prototype.createRejectionError_ = function(err) {
    return new AmdLoadError({
      code: err.requireType,
      modules: err.requireModules
    });
  };


  return PromiseToRequire;
});
