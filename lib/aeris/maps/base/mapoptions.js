define(['aeris'], function(aeris) {

  /**
   * @fileoverview Interface definition for changing a map's options.
   */


  aeris.provide('aeris.maps.MapOptions');


  /**
   * Creates a map options helper that binds to an aeris map and delegates
   * options to.
   *
   * @param {aeris.maps.Map} aerisMap The aeris map to bind to and delegate
   *                                  option requests to.
   * @param {Object} options An object of map options to be applied to the map.
   * @constructor
   */
  aeris.maps.MapOptions = function(aerisMap, options) {


    /**
     * The aeris map delegating the options.
     *
     * @type {aeris.map.Map}
     */
    this.aerisMap = aerisMap


    /**
     * The actual map which to apply the options to.
     *
     * @type {Object}
     */
    this.map = aerisMap.map;


    this.set(options);

  };


  /**
   * Set the center point of the map using the given map implementation's
   * lat/lon representation or an array ([lat, lon]).
   *
   * @param {Object|Array.<number>} center The center point.
   * @return {undefined}
   */
  aeris.maps.MapOptions.prototype.setCenter =
      aeris.notImplemented('MapOptions.setCenter');


  /**
   * Set the zoom level of the map.
   *
   * @param {number} zoom The zoom level.
   * @return {undefined}
   */
  aeris.maps.MapOptions.prototype.setZoom =
      aeris.notImplemented('MapOptions.setZoom');


  /**
   * Ensure the center option is in the correct lat/lon format.
   *
   * @param {Object|Array.<number>} center The center option.
   * @return {Object}
   * @private
   */
  aeris.maps.MapOptions.prototype.ensureCenter_ = function(center) {
    center = this.aerisMap.toLatLon(center);
    return center;
  };


  /**
   * Set the values of an object of options to the map.
   *
   * @param {Object} options An object of map options to be applied to the map.
   * @return {undefined}
   */
  aeris.maps.MapOptions.prototype.set = function(options) {
    options = this.ensure(options);

    for (var opt in options) {
      var method = 'set' + aeris.ucfirst(opt);
      if (this[method])
        this[method](options[opt]);
    }
  };


  /**
   * Ensure the values of an object of options.
   *
   * @param {Object} options An object of map options to ensure.
   * @return {Object}
   */
  aeris.maps.MapOptions.prototype.ensure = function(options) {
    for (var opt in options) {
      var method = 'ensure' + aeris.ucfirst(opt) + '_';
      if (this[method])
        options[opt] = this[method](options[opt]);
    }

    return options;
  };


  return aeris.maps.MapOptions;

});
