define([
  'aeris/util',
  'aeris/errors/invalidargumenterror',
  'base/abstractmap',
  'aeris/strategy'
], function(_, InvalidArgumentError, AbstractMap) {

  /**
   * @fileoverview Abstraction for an object that can be handled by a map
   *               extension.
   */


  _.provide('aeris.maps.extension.MapExtensionObject');


  /**
   * An abstraction for an object to be handled by a map extension.
   *
   * @constructor
   * @class aeris.maps.extension.MapExtensionObject
   */
  aeris.maps.extension.MapExtensionObject = function() {


    /**
     * A name/type for the object.
     *
     * @type {string}
     */
    this.name = null;


    /**
     * A unique id for identifying
     * each MapExtensionObject
     *
     * @type {string}
     */
    this.id = _.uniqueId('object_');


    /**
     * An AerisMap that the object is bound to. This is set with setMap.
     *
     * @type {aeris.maps.AbstractMap}
     * @protected
     */
    this.aerisMap = null;


    /**
     * The strategy container for supporting prioritization of implementation.
     *
     * @type {aeris.Strategy}
     */
    this.strategy = new aeris.Strategy();

  };


  /**
   * Set the map.
   *
   * @param {aeris.maps.AbstractMap} aerisMap The map to bind to.
   */
  aeris.maps.extension.MapExtensionObject.prototype.setMap = function(aerisMap) {
    if (!(aerisMap instanceof AbstractMap)) {
      throw new InvalidArgumentError('Cannot set object\'s map: Invalid Aeris Map.');
    }

    this.aerisMap = aerisMap;
  };


  /**
   * Get the map.
   *
   * @return {aeris.maps.AbstractMap}
   */
  aeris.maps.extension.MapExtensionObject.prototype.getMap = function() {
    return this.aerisMap;
  };


  /**
   * @return {Boolean} Returns true if the layer has a map set.
   */
  aeris.maps.extension.MapExtensionObject.prototype.hasMap = function() {
    return !!this.aerisMap;
  };


  return aeris.maps.extension.MapExtensionObject;

});
