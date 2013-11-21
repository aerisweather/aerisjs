define([
  'base/extension/mapextensionobject',
  'aeris/util',
  'aeris/errors/validationerror'
], function(MapExtensionObject, _, ValidationError) {
  /**
   * A representation of an icon on a map.
   *
   * @param {Object=} opt_attrs
   * @param {Array.<number>} opt_attrs.position The lat/lon position to set the Marker.
   * @param {Boolean=} opt_attrs.clickable Whether the user can click the marker. Default is true.
   * @param {Boolean=} opt_attrs.draggable Whether the user can drag the marker. Default is true.
   * @param {string=} opt_attrs.url URL to the icon.
   * @param {number=} opt_attrs.width Width of the icon, in pixels.
   * @param {number=} opt_attrs.height Height of the icon, in pixels.
   *
   * @constructor
   * @class aeris.maps.Marker
   * @extends {aeris.maps.extension.MapExtensionObject}
   */
  var Marker = function(opt_attrs, opt_options) {
    /**
     * @event click
     * @param {Array.<number>} latLon
     * @param {aeris.maps.Marker} marker
     */
    /**
     * @event dragend
     * @param {Array.<number>} latLon
     * @param {aeris.maps.Marker} marker
     */

    var attrs = _.extend({
      /**
       * @attribute position
       * @type {Array.<number>}
       */
      position: [45, -90],

      /**
       * Icon url.
       *
       * @attribute url
       * @type {string}
       */
      url: 'http://iwx.aerisapi.com/v1.6/wnmapapp/css/assets/markers/earthquake/quake_mini.png',

      /**
       * Pixels between the marker's lat/lon
       * position and the left side of the icon image.
       *
       * @attribute width
       * @type {number}
       */
      offsetX: 20,

      /**
       * Pixels between the marker's lat/lon
       * position and the bottom of the icon image.
       *
       * @attribute height
       * @type {number}
       */
      offsetY: 20,

      /**
       * Whether to allow click events
       * on the marker.
       *
       * @attribute clickable
       * @type {Boolean}
       */
      clickable: true,

      /**
       * Whether to allow drag events
       * on the marker.
       *
       * @attribute draggable
       * @type {Boolean}
       */
      draggable: false,


      /**
       * Marker title.
       *
       * @attribute title
       * @type {string}
       * @default ''
       */
      title: ''
    }, opt_attrs);

    var options = _.defaults(opt_options || {}, {
      strategy: 'markerstrategies/markerstrategy'
    });

    MapExtensionObject.call(this, attrs, options);
  };
  _.inherits(Marker, MapExtensionObject);


  /**
   * @override
   */
  Marker.prototype.validate = function(attrs) {
    if (
      attrs.position && (
        !_.isArray(attrs.position) || !_.isNumber(attrs.position[0]) || attrs.position.length !== 2
      )
    ) {
      return new ValidationError(attrs.position + ' is not a valid latLon position');
    }
    if (!_.isString(attrs.title)) {
      return new ValidationError(attrs.title + ' is not a valid marker title.');
    }
  };


  /**
   * @param {Array.<number>} latLon
   */
  Marker.prototype.setPosition = function(latLon) {
    this.set('position', latLon, { validate: true });
  };


  /**
   * @return {Array.<number>}
   */
  Marker.prototype.getPosition = function() {
    return this.get('position');
  };


  /**
   * @param {string} url
   */
  Marker.prototype.setUrl = function(url) {
    this.set('url', url, { validate: true });
  };


  return _.expose(Marker, 'aeris.maps.Marker');
});
