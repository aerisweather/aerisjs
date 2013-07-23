define([
  'aeris',
  'aeris/errors/invalidargumenterror',
  'aeris/strategy'
], function(aeris, InvalidArgumentError) {

  /**
   * @fileoverview Abstraction for an object that can be handled by a map
   *               extension.
   */


  aeris.provide('aeris.maps.extension.MapExtensionObject');


  /**
   * An abstraction for an object to be handled by a map extension.
   *
   * @constructor
   * @extends {aeris.maps.extension.MapExtensionObject}
   */
  aeris.maps.extension.MapExtensionObject = function() {


    /**
     * A name/type for the object.
     *
     * @type {string}
     */
    this.name = null;


    /**
     * An AerisMap that the object is bound to. This is set with setMap.
     *
     * @type {aeris.maps.Map}
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
   * @param {aeris.maps.Map} aerisMap The map to bind to.
   */
  aeris.maps.extension.MapExtensionObject.prototype.setMap = function(aerisMap) {
    if (!(aerisMap instanceof aeris.maps.Map)) {
      throw new InvalidArgumentError('Cannot set object\'s map: Invalid Aeris Map.');
    }

    this.aerisMap = aerisMap;
  };


  /**
   * Get the map.
   *
   * @return {aeris.maps.Map}
   */
  aeris.maps.extension.MapExtensionObject.prototype.getMap = function() {
    return this.aerisMap;
  };


  return aeris.maps.extension.MapExtensionObject;

});
