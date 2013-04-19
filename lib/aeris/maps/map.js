define(['aeris'], function(aeris) {

  /**
   * @fileoverview Interface definition for working with maps.
   */


  aeris.provide('aeris.maps.Map');


  /**
   * Creates a new map by instantiating and wrapping an implemented javascript
   * mapping library.
   *
   * @param {string|Node} div The HTML node or string of the node's id for
   *                          displaying the map.
   * @param {Object} options An object of options to be applied and/or
   *                         delegated.
   * @constructor
   */
  aeris.maps.Map = function(div, options) {


    /**
     * The wrapped javascript mapping library's map object.
     *
     * @type {Object}
     */
    this.map = this.createMap(div);


    /**
     * The layer manager used to support delegation of the map's layers.
     *
     * @type {aeris.maps.LayerManager}
     */
    this.layers = this.createLayerManager(options);


    /**
     * The map options used to support delegation of the map's options.
     *
     * @type {aeris.maps.MapOptions}
     */
    this.options = this.createOptions(options);

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
   * An implemented MapOption's constructor used for instantiating a MapOption
   * to delegate map options to.
   *
   * @protected {Function} A MapOption's constructor.
   */
  aeris.maps.Map.prototype.mapOptionsClass =
      aeris.notImplemented('Map.mapOptionsClass');


  /**
   * Create a new MapOption object.
   *
   * @param {Object} options An object of map options.
   * @return {aeris.maps.MapOption} A new MapOption.
   * @protected
   */
  aeris.maps.Map.prototype.createOptions = function(options) {
    return new this.mapOptionsClass(this, options);
  };


  /**
   * An implemented LayerManager's constructor used for instantiated a
   * LayerManager to delegate layer options to.
   *
   * @protected {Function} A LayerManager's constructor.
   */
  aeris.maps.Map.prototype.layerManagerClass =
      aeris.notImplemented('Map.layerManagerClass');


  /**
   * Create a new LayerManager object.
   *
   * @param {Object} options An object of layer options.
   * @return {aeris.maps.LayoutManager} A new LayoutManager.
   * @protected
   */
  aeris.maps.Map.prototype.createLayerManager = function(options) {
    return new this.layerManagerClass(this, options);
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
