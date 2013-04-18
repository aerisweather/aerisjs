define(["aeris"], function(aeris) {

  /**
   * @fileoverview Interface definitions for working with maps.
   */


  aeris.provide("aeris.maps.Map");


  /**
   * Creates a new map by instantiating and wrapping an implemented javascript
   * mapping library.
   *
   * @param {string|Node} div The HTML node or string of the node's id for
   *                          displaying the map.
   * @param {Object} options An object of map options to be applied to the map.
   * @constructor
   */
  aeris.maps.Map = function(div, options) {
    this.map = this.createMap(div);
    this.options = this.createOptions(this, options);
  };


  /**
   * A constructor of the wrapped javascript mapping library's map class.
   *
   * @protected {Function} An external constructor.
   */
  aeris.maps.Map.prototype.apiMapClass = aeris.notImplemented('Map.apiMapClass');


  /**
   * Create a new wrapped map.
   *
   * @param {string|Node} div The HTML node or string of the node's id for
   *                          displaying the map.
   * @return {Object} A new wrapped map.
   * @protected
   */
  aeris.maps.Map.prototype.createMap = aeris.notImplemented('Map.createMap');


  /**
   * An implemented MapOption's constructor.
   *
   * @protected {Function} A MapOption's constructor.
   */
  aeris.maps.Map.prototype.mapOptionsClass =
      aeris.notImplemented('Map.mapOptionsClass');


  /**
   * Create a new MapOption object.
   *
   * @param {Map} map The map to bind the options to.
   * @param {Object} options An object of map options.
   * @return {MapOption} A new MapOption.
   * @protected
   */
  aeris.maps.Map.prototype.createOptions = function(map, options) {
    return new this.mapOptionsClass(map, options);
  };


  /**
   * Convert an array of latitude and longitude to the appropriate wrapped
   * map's lat/lon object.
   *
   * @param {Array} latLon An array of latitude and longitude in the form of
   *                       [-34.123, 145.333].
   * @return {Object} The wrapped map's lat/long object representing the given
   *                  latLong.
   * @public
   */
  aeris.maps.Map.prototype.toLatLon = aeris.notImplemented('Map.toLatLon');


  return aeris.maps.Map;
});
