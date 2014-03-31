define([
  'aeris/util',
  'aeris/events',
  'aeris/errors/validationerror',
  'aeris/maps/extensions/mapextensionobject',
  'aeris/maps/strategy/map'
], function(_, Events, ValidationError, MapExtensionObject, MapStrategy) {
  /**
   * An Aeris {aeris.maps.Map} is the base object on which all other map objects live. Any {aeris.maps.MapObjectInterface} object can be added to a map using the `setMap` method:
   *
   * <code class="example">
   *   var map = new aeris.maps.Map('map-canvas-id');
   *   mapObject.setMap(map);  // adds the object to the map
   *   mapobject.setMap(null); // removes the object from the map
   * </code>
   *
   * {aeris.maps.markers.Marker} and {aeris.maps.layers.AerisRadar} are examples of {aeris.maps.MapObjectInterface} objects which can be set to a map.
   *
   * @publicApi
   * @class Map
   * @namespace aeris.maps
   * @extends aeris.maps.extensions.MapExtensionObject
   * @override
   *
   * @param {HTMLElement|string} el Map canvas element, by reference or id.
   *
   * @param {Object=} opt_attrs Attributes to set on the map on initialization
   * @param {aeris.maps.LatLon=} opt_attrs.center
   * @param {number=} opt_attrs.zoom
   *
   * @param {Object=} opt_options
   *
   * @constructor
   * @throws {aeris.errors.ValidationError} If no element is supplied.
   */
  var Map = function(el, opt_attrs, opt_options) {
    /**
     * @event click
     * @param {aeris.maps.LatLon} latLon
     */
    /**
     * @event dblclick
     * @param {aeris.maps.LatLon} latLon
     */
    /**
     * When base map tiles are loaded.
     * @event load
     */
    var attrs = _.extend({
      /**
       * @attribute center
       * @type {aeris.maps.LatLon} LatLon coordinate.
       */
      center: [45, -90],


      /**
       * LatLon bounds of the map viewport.
       *
       * @attribute bounds
       * @type {aeris.maps.Bounds} LatLons of SW and NE corners.
       * @default A rough box around the US
       */
      bounds: [
        [22.43, -135.52],
        [52.37, -55.016]
      ],

      /**
       * @attribute zoom
       * @type {number}
       */
      zoom: 4
    }, opt_attrs);

    var options = _.extend({
      strategy: MapStrategy,
      validate: true
    }, opt_options);

    /**
     * @property mapEl_
     * @private
     * @type {string|HTMLElement|{}} Map element be also be a reference to a pre-existing map view
     */
    this.mapEl_ = this.normalizeElement_(el);

    this.validateElementExists_(this.mapEl_);


    Events.call(this);
    MapExtensionObject.call(this, attrs, options);
  };
  _.inherits(Map, MapExtensionObject);
  _.extend(Map.prototype, Events.prototype);


  Map.prototype.validate = function(attrs) {
    if (!_.isArray(attrs.center)) {
      return new ValidationError('center', attrs.center + ' is not a valid coordinate');
    }
    if (!_.isNumber(attrs.zoom)) {
      return new ValidationError('zoom', attrs.zoom + ' is not a valid zoom level');
    }
  };

  /**
   * @method setBounds
   * @param {aeris.maps.Bounds} bounds
   */
  Map.prototype.setBounds = function(bounds) {
    this.set('bounds', bounds, { validate: true });
  };

  /**
   * @method getBounds
   * @return {aeris.maps.Bounds}
   */
  Map.prototype.getBounds = function() {
    return this.get('bounds');
  };


  /**
   * @method getView
   * @return {Object} The view object creating by the mapping library.
   */
  Map.prototype.getView = function() {
    return this.strategy_.getView();
  };

  /**
   * @method setCenter
   * @param {aeris.maps.LatLon} center
   */
  Map.prototype.setCenter = function(center) {
    this.set('center', center, { validate: true });
  };

  /**
   * @method getCenter
   * @return {aeris.maps.LatLon}
   */
  Map.prototype.getCenter = function() {
    return this.get('center');
  };


  /**
   * @method setZoom
   * @param {number} zoom
   */
  Map.prototype.setZoom = function(zoom) {
    this.set('zoom', zoom, { validate: true });
  };

  /**
   * @method getZoom
   * @return {number}
   */
  Map.prototype.getZoom = function() {
    return this.get('zoom');
  };


  /**
   * Zoom and center the map in order to fit
   * the viewport to the specified bounds.
   *
   * This is currently only supported when using Google Maps.
   *
   * @throws {Error} If fitToBounds is not supported by mapping library.
   * @param {aeris.maps.Bounds} bounds
   */
  Map.prototype.fitToBounds = function(bounds) {
    if (!this.strategy_ || !this.strategy_.fitToBounds) {
      throw Error('Unable to fit to bounds: no fitToBounds strategy has been implemented');
    }

    this.strategy_.fitToBounds(bounds);
  };


  /**
   * @method normalizeElement_
   * @private
   * @param {string|HTMLElement} el Element, or element id.
   * @return {HTMLElement}
   */
  Map.prototype.normalizeElement_ = function(el) {
    return _.isString(el) ? document.getElementById(el) : el;
  };


  /**
   * @throws {aeris.errors.ValidationError}
   * @method validateElementExists_
   * @private
   */
  Map.prototype.validateElementExists_ = function(el) {
    if (!el) {
      throw new ValidationError('el', el + ' is not a valid map canvas element or id');
    }
  };


  /**
   * @method getElement
   * @return {HTMLElement} The map canvas element
   */
  Map.prototype.getElement = function() {
    return this.mapEl_;
  };


  return _.expose(Map, 'aeris.maps.Map');
});
