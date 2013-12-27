define([
  'vendor/underscore',
  'when'
], function(_, when) {
  /**
   * Helper class for extedning WireJS specs.
   *
   * @param {Function} wire
   * @constructor
   */
  var SpecExtender = function (wire) {
    this.wire_ = wire;
  };

  /**
   * Extends specs defined in AMD modules.
   *
   * @param specModuleIds
   * @returns {Promise} Promise/A+. Resolves with extended spec.
   */
  SpecExtender.prototype.extendSpecModules = function(specModuleIds) {
    return this.loadModules_(specModuleIds).
      then(this.extendSpecs);
  };


  /**
   * @param moduleIds
   * @returns {Promise} Promise/A+. Resolves with array of modules.
   * @private
   */
  SpecExtender.prototype.loadModules_ = function(moduleIds) {
    var loadModulePromises = _.map(moduleIds, function(modId) {
      return this.wire_.loadModule(modId);
    }, this);

    return when.all(loadModulePromises);
  };


  /**
   * @param {Array.<Object>} specs
   * @return {Object}
   */
  SpecExtender.prototype.extendSpecs = function(specs) {
    return _.extend.apply(_, specs);
  };


  return SpecExtender;
});
