define([
  'aeris/util',
  'aeris/errors/invalidargumenterror',
  'base/extension/mapextension'
], function(_, InvalidArgumentError) {

  /**
   * @fileoverview Extend a map extension to support the strategy pattern and
   *               an object pool.
   */


   _.provide('aeris.maps.extension.MapExtensionManager');


  /**
  * Extension of the map extension to support the strategy pattern and an
  * object pool.
  *
  * @constructor
  * @class aeris.maps.extension.MapExtensionManager
  * @extends {aeris.maps.extension.MapExtension}
  */
  aeris.maps.extension.MapExtensionManager = function(aerisMap, opt_options) {
    aeris.maps.extension.MapExtension.call(this, aerisMap, opt_options);


    /**
     * A hash of instantiated layer strategies.
     *
     * @type {Object.<string,aeris.maps.extension.MapExtensionStrategy>}
     * @private
     */
    this.strategies_ = {};


    /**
     * A hash of instantiated instances.
     *
     * @type {Object<string,Object}
     * @protected
     */
    this.instances_ = {};
  };
  _.inherits(aeris.maps.extension.MapExtensionManager,
                 aeris.maps.extension.MapExtension);


  /**
   * A hash of strategies that are supported.
   *
   * @type {Object.<string,Function>}
   */
  aeris.maps.extension.MapExtensionManager.prototype.strategies = {};


  /**
   * Get an implemented strategy.
   *
   * @param {aeris.maps.extension.MapExtensionObject} object The object to get.
   *     the strategy for.
   * @return {aeris.maps.extension.MapExtensionStrategy}
   */
  aeris.maps.extension.MapExtensionManager.prototype.getStrategy =
      function(object) {
    var strategyKey = object.strategy.select(this.strategies);
    var instanceKey = strategyKey + '_' + object.name;
    var strategy = null;
    if (this.strategies[strategyKey]) {
      if (!this.strategies_[instanceKey]) {
        this.strategies_[instanceKey] = new this.strategies[strategyKey]();
      }
      strategy = this.strategies_[instanceKey];
    }
    return strategy;
  };


  /**
   * Get an instance wrapper for an object.
   *
   * @param {aeris.maps.extension.MapExtensionObject} object The object to get
   *   the instance for.
   * @return {Object}
   */
  aeris.maps.extension.MapExtensionManager.prototype.getInstance = function(object) {
    var instance = this.instances_[object.id];

    if (!instance) {
      if (_.isUndefined(object.id)) {
        throw new InvalidArgumentError('A MapExtensionObject must define an id');
      }
      instance = this.instances_[object.id] = {};
    }
    return instance;
  };


  return aeris.maps.extension.MapExtensionManager;

});
