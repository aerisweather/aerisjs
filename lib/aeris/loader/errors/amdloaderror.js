define([
  'aeris/util',
  'aeris/errors/abstracterror'
], function (_, AbstractError) {
  /**
   * Failed to load a AMD module.
   *
   * @class aeris.loader.errors.AmdLoadError
   * @extends aeris.errors.AbstractError
   *
   * @constructor
   * @override
   *
   * @param {Object} errObj
   * @param {string} errObj.code
   * @param {Array.<string>} errObj.modules
   */
  var AmdLoadError = function (errObj) {
    /** @property {string} code */
    this.code = errObj.code || '';

    /** @property {Array.<string>} modules */
    this.modules = errObj.modules || [];

    AbstractError.apply(this, arguments);
  };
  _.inherits(AmdLoadError, AbstractError);


  /** @override */
  AmdLoadError.prototype.setName = function () {
    return 'AmdLoadError';
  };


  /** @override */
  AmdLoadError.prototype.setMessage = function() {
    return 'Failed to load modules: ' + this.getModuleNames_() + '.' +
      ' Error code: ' + this.code;
  };


  /**
   * @private
   * @return {string}
   */
  AmdLoadError.prototype.getModuleNames_ = function() {
    return '\'' + this.modules.join('\', \'') + '\'';
  };


  return AmdLoadError;
});
