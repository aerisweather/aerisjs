define(['aeris', 'base/marker'], function(aeris) {

  /**
   * @fileoverview Representation of an Icon Marker.
   */


  aeris.provide('aeris.maps.markers.Icon');


  /**
   * Create an Icon Marker.
   *
   * @param {Array.<Number, Number>} position The lat/long position of the Icon.
   * @param {string='/assets/wx-details-marker.png'} opt_url URL to the icon.
   * @param {number=20} width Width of the icon.
   * @param {number=20} height Height of the icon.
   * @constructor
   * @extends {aeris.maps.Marker}
   */
  aeris.maps.markers.Icon = function(position, opt_url, width, height, opt_options) {
    aeris.maps.Marker.call(this, position, opt_options);
    this.strategy.push('Icon');


    /**
     * @override
     */
    this.name = 'Icon';


    /**
     * The URL of the Icon.
     *
     * @type {string}
     */
    this.url = opt_url || aeris.config.path + 'assets/marker_yellow.png';


    /**
     * The width of the Icon.
     *
     * @type {number}
     */
    this.width = width || 20;


    /**
     * The height of the Icon.
     *
     * @type {number}
     */
    this.height = height || 20;

  };
  aeris.inherits(aeris.maps.markers.Icon, aeris.maps.Marker);


  return aeris.maps.markers.Icon;

});
