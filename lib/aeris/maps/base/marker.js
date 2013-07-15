define(['aeris', 'base/extension/mapextensionobject'], function(aeris) {

  /**
   * @fileoverview Interface definition for defining a map marker.
   */


  aeris.provide('aeris.maps.Marker');


  /**
   * Create an abstract map marker.
   *
   * @param {Array.<number>} position The lat/lon position to set the Marker.
   * @param {Object} opt_options
   * @param {Function} opt_options.click Option click callback.
   * @constructor
   * @extends {aeris.maps.extension.MapExtensionObject}
   * @mixes {aeris.Events.prototype}
   */
  aeris.maps.Marker = function(position, opt_options) {
    aeris.maps.extension.MapExtensionObject.call(this);
    aeris.Events.call(this);

    var options = opt_options || {};


    /**
     * The lat/lon position of the Marker.
     *
     * @type {Array.<number>}
     */
    this.position = position;


    /**
     * The click callback function
     *
     * @type {Function}
     */
    this.click = options.click;

  };
  aeris.inherits(aeris.maps.Marker, aeris.maps.extension.MapExtensionObject);
  aeris.extend(aeris.maps.Marker.prototype, aeris.Events.prototype);


  /**
   * @override
   */
  aeris.maps.Marker.prototype.setMap = function(aerisMap) {
    aeris.maps.extension.MapExtensionObject.prototype.setMap.
        call(this, aerisMap);
    this.aerisMap.markers.setMarker(this);
  };


  aeris.maps.Marker.prototype.remove = function() {
    var map = this.aerisMap;
    this.aerisMap = null;
    map.markers.removeMarker(this);
  };


  return aeris.maps.Marker;

});
