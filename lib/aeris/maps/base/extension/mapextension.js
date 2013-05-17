define(['aeris'], function(aeris) {

  /**
   * @fileoverview An abstractions on a map extension (delegation) which
   *               extends the functionality of a map.
   */


  aeris.provide('aeris.maps.extension.mapextension');


  /**
   * An abstraction of a map extension.
   *
   * @constructor
   * @param {aeris.maps.Map} aerisMap The aeris map to bind to for delegation.
   * @param {Object=} opt_options Optional option object.
   * @constructor
   */
  aeris.maps.extension.MapExtension = function(aerisMap, option) {


    /**
     * The aeris map to delegate for.
     *
     * @type {aeris.map.Map}
     */
    this.aerisMap = aerisMap;


    /**
     * The map instance which to delegate for.
     *
     * @type {Object}
     */
    this.map = aerisMap.map;


    /**
     * A hash of instantiated layer strategies.
     *
     * @type {Object.<string,aeris.maps.extension.MapExtensionStrategy>}
     * @private
     */
    this.strategies_ = {};

  };


  /**
   * A hash of strategies that are supported.
   *
   * @type {Object.<string,Function>}
   */
  aeris.maps.extension.MapExtension.prototype.strategies = {};


  /**
   * Get an implemented strategy.
   *
   * @param {aeris.maps.extension.MapExtensionObject} object The object to get.
   *     the strategy for.
   * @return {aeris.maps.extension.MapExtensionStrategy}
   */
  aeris.maps.extension.MapExtension.prototype.getStrategy = function(object) {
    var strategyKey = object.strategy.select(this.strategies);
    var instanceKey = strategyKey + '_' + object.name
    var strategy = null;
    if (this.strategies[strategyKey]) {
      if (!this.strategies_[instanceKey])
        this.strategies_[instanceKey] =
            new this.strategies[strategyKey]();
      strategy = this.strategies_[instanceKey];
    }
    return strategy;
  };


  return aeris.maps.extension.MapExtension;

});
