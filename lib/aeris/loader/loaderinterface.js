define([
  'aeris/util'
], function(_) {
  /**
   * @abstract
   * @class aeris.loader.LoaderInterface
   * @constructor
   */
  var LoaderInterface = function() {};


  /**
   * @method
   * @param {Array.<string>} modules
   * @param {Object=} opt_options
   * @param {Function} opt_options.onload
   * @param {Function} opt_options.onerror
   *
   * @return {aeris.Promise} A promise to the load.
   */
  LoaderInterface.prototype.load = _.abstractMethod;


  return LoaderInterface;
});
