define([
  'aeris',
  'aeris/errors/invalidargumenterror',
  'base/map'
], function(aeris, InvalidArgumentError, MapInterface) {

  /**
   * @fileoverview An abstractions on a map extension (delegation) which
   *               extends the functionality of a map.
   */


  aeris.provide('aeris.maps.extension.MapExtension');


  /**
   * An abstraction of a map extension.
   *
   * @constructor
   * @param {aeris.maps.Map} aerisMap The aeris map to bind to for delegation.
   * @param {Object=} opt_options Optional option object.
   * @constructor
   */
  aeris.maps.extension.MapExtension = function(aerisMap, opt_options) {
    if (!(aerisMap instanceof MapInterface)) {
      throw new InvalidArgumentError('A map extension requires an Aeris Map.');
    }

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

  };


  return aeris.maps.extension.MapExtension;

});
