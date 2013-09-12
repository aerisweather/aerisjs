define([
  'base/extension/mapextensionobject',
  'aeris/events',
  'aeris/util'
], function(MapExtensionObject, Events, _) {

  /**
   * @fileoverview Interface definition for defining a map marker.
   */


  _.provide('aeris.maps.Marker');


  /**
   * Create an abstract map marker.
   *
   * @param {Array.<number>} position The lat/lon position to set the Marker.
   * @param {Object=} opt_options
   * @param {Boolean=} opt_options.clickable Whether the user can click the marker. Default is true.
   * @param {Boolean=} opt_options.draggable Whether the user can drag the marker. Default is true.
   *
   * @constructor
   * @class aeris.maps.Marker
   * @extends {aeris.maps.extension.MapExtensionObject}
   * @mixes {aeris.Events.prototype}
   */
  aeris.maps.Marker = function(position, opt_options) {
    aeris.maps.extension.MapExtensionObject.call(this);
    aeris.Events.call(this);


    /**
     * Options associated with this marker
     * @type {Object}
     */
    this.options = _.extend({
      clickable: true,
      draggable: false
    }, opt_options);


    /**
     * The lat/lon position of the Marker.
     *
     * @type {Array.<number>}
     */
    this.position = position;

  };
  _.inherits(aeris.maps.Marker, aeris.maps.extension.MapExtensionObject);
  _.extend(aeris.maps.Marker.prototype, aeris.Events.prototype);


  /**
   * @override
   */
  aeris.maps.Marker.prototype.setMap = function(aerisMap) {
    aeris.maps.extension.MapExtensionObject.prototype.setMap.call(this, aerisMap);
    this.aerisMap.markers.setMarker(this);
  };


  /**
   * Remove marker from the map.
   */
  aeris.maps.Marker.prototype.remove = function() {
    if (this.aerisMap) {
      var map = this.aerisMap;
      this.aerisMap = null;
      map.markers.removeMarker(this);
    }
  };


  return aeris.maps.Marker;

});
