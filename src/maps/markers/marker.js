define([
  'aeris/util',
  'aeris/maps/extensions/mapextensionobject',
  'aeris/togglebehavior',
  'aeris/errors/validationerror',
  'aeris/maps/strategy/markers/marker'
], function(_, MapExtensionObject, ToggleBehavior, ValidationError, MarkerStrategy) {
  /**
   * A marked location on a map.
   *
   * A Marker is a type of {aeris.ViewModel}, which means that it can bind its attributes to a data model ({aeris.Model} or {Backbone.Model}). This allows you to easily bind data from an API to a marker, or {aeris.maps.markercollections.MarkerCollection}.
   *
   * For example, say you have a data model called `Place`, which receives data from an API like so:
   *
   * <code class="example">
   *    var place = new Place();
   *    place.fetch();
   *    //...
   *    place.toJSON === {
   *      id: 1,
   *      description: 'Joe\'s bar and grill.',
   *      category: 'restaurant',
   *      location: {
   *        lat: 45.23,
   *        long: -90.87
   *      }
   *    }
   * </code>
   *
   * You can now bind a {aeris.maps.Marker} to the place data:
   *
   * <code class="example">
   *    var placeMarker = new aeris.maps.Marker(null, {
   *      data: place,
   *
   *      // Use attribute transforms to translate raw data
   *      // into marker attributes.
   *      // Any changes to the Place model will be reflected
   *      // in the placeMarker, using these attributeTransforms.
   *      attributeTransforms: {
   *
   *        // Format position as [lat, lon]
   *        position: function() {
   *          return [
   *            this.getDataAttribute('location.lat'),
   *            this.getDataAttribute('location.long')
   *          ];
   *        },
   *
   *        // Use data description as marker title
   *        title: function() {
   *          return this.getDataAttribute('description');
   *        },
   *
   *        // Choose a icon url based on the
   *        // data category
   *        url: function() {
   *          var category = this.getDataAttribute('category');
   *
   *          if (category === 'restaurant') {
   *            return 'restaurant_icon.png';
   *          }
   *          else {
   *            return 'some_other_place_icon.png'
   *          }
   *        }
   *      }
   *    });
   * </code>
   *
   * @publicApi
   * @class Marker
   * @namespace aeris.maps.markers
   *
   * @extends aeris.maps.extensions.MapExtensionObject
   * @uses aeris.maps.ToggleBehavior
   * @publicApi
   *
   * @constructor
   *
   * @param {Object=} opt_attrs
   * @param {aeris.maps.LatLon} opt_attrs.position The lat/lon position to set the Marker.
   * @param {Boolean=} opt_attrs.clickable Whether the user can click the marker. Default is true.
   * @param {Boolean=} opt_attrs.draggable Whether the user can drag the marker. Default is true.
   * @param {string=} opt_attrs.url URL to the icon.
   * @param {number=} opt_attrs.width Width of the icon, in pixels.
   * @param {number=} opt_attrs.height Height of the icon, in pixels.
   *
   * @param {Object=} opt_options
   * @param {aeris.maps.AbstractStrategy} opt_options.strategy
   */
  var Marker = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      strategy: MarkerStrategy
    });

    var attrs = _.defaults(opt_attrs || {}, {
      /**
       * @attribute position
       * @type {aeris.maps.LatLon}
       */
      position: [45, -90],

      /**
       * Icon url.
       *
       * @attribute url
       * @type {string}
       */
      url: '//iwx.aerisapi.com/v1.6/wnmapapp/css/assets/markers/earthquake/quake_mini.png',

      /**
       * Pixels between the marker's lat/lon
       * position and the left side of the icon image.
       *
       * @attribute offsetX
       * @type {number}
       */
      offsetX: 9,

      /**
       * Pixels between the marker's lat/lon
       * position and the top of the icon image.
       *
       * @attribute offsetY
       * @type {number}
       */
      offsetY: 9,

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
    });

    // Default selected styles to base styles
    attrs.selectedUrl || (attrs.selectedUrl = attrs.url);
    attrs.selectedOffsetX || (attrs.selectedOffsetX = attrs.offsetX);
    attrs.selectedOffsetY || (attrs.selectedOffsetY = attrs.offsetY);

    MapExtensionObject.call(this, attrs, options);
    ToggleBehavior.call(this);
  };
  _.inherits(Marker, MapExtensionObject);
  _.extend(Marker.prototype, ToggleBehavior.prototype);


  /**
   * @method validate
   * @protected
   */
  Marker.prototype.validate = function(attrs) {
    if (
      attrs.position && (
        !_.isArray(attrs.position) || !_.isNumber(attrs.position[0]) || !_.isNumber(attrs.position[1]) ||
        attrs.position.length !== 2
      )
    ) {
      return new ValidationError(attrs.position.toString() + ' is not a valid latLon position');
    }
    if (!_.isString(attrs.title)) {
      return new ValidationError(attrs.title + ' is not a valid marker title.');
    }
  };


  /**
   * @param {aeris.maps.LatLon} latLon
   * @method setPosition
   */
  Marker.prototype.setPosition = function(latLon) {
    this.set('position', latLon, { validate: true });
  };


  /**
   * @return {aeris.maps.LatLon}
   * @method getPosition
   */
  Marker.prototype.getPosition = function() {
    return this.get('position');
  };


  /**
   * @param {string} url
   * @method setUrl
   */
  Marker.prototype.setUrl = function(url) {
    this.set('url', url, { validate: true });
  };


  /**
   * Return the url of the marker icon.
   *
   * @method getUrl
   * @return {string}
  */
  Marker.prototype.getUrl = function() {
    return this.get('url');
  };

  /**
   * @method setSelectedUrl
   * @param {string} selectedUrl
   */
  Marker.prototype.setSelectedUrl = function(selectedUrl) {
    this.set('selectedUrl', selectedUrl, { validate: true });
  };

  /**
   * @method getSelectedUrl
   * @return {string}
   */
  Marker.prototype.getSelectedUrl = function() {
    return this.get('selectedUrl');
  };


  /**
   * This method method may be overriden to return
   * an arbitrary "type" category for the marker.
   * Used by MarkerClusterer strategies to split up
   * a single MarkerColection into several cluster sets.
   *
   * @method getType
   * @return {?string}
   */
  Marker.prototype.getType = function() {
    return null;
  };


  return _.expose(Marker, 'aeris.maps.markers.Marker');
});
