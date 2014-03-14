define([
  'aeris/util',
  'aeris/events',
  'aeris/errors/validationerror',
  'aeris/maps/extensions/mapextensionobject',
  'aeris/maps/strategy/map',
  'aeris/maps/layers/googleroadmap'
], function(_, Events, ValidationError, MapExtensionObject, MapStrategy, GoogleRoadMap) {
  /**
   * @publicApi
   * @class Map
   * @namespace aeris.maps
   * @extends aeris.maps.extensions.MapExtensionObject
   *
   * @param {HTMLElement|string} el Map canvas element, by reference or id.
   * @constructor
   */
  var Map = function(el, opt_attrs, opt_options) {
    /**
     * @event click
     * @param {aeris.maps.LatLng} latLon
     */
    /**
     * @event dblclick
     * @param {aeris.maps.LatLng} latLon
     */
    /**
     * When base map tiles are loaded.
     * @event load
     */
    var attrs = _.extend({
      /**
       * @attribute center
       * @type {aeris.maps.LatLng} LatLon coordinate.
       */
      center: [45, -90],


      /**
       * LatLon bounds of the map viewport.
       *
       * @attribute bounds
       * @type {aeris.maps.Bounds} LatLons of SW and NE corners.
       */
      bounds: [[22.43, -135.52], [52.37, -55.016]], // A rough box around the US,

      /**
       * @attribute baseLayer
       * @type {aeris.maps.layers.AbstractTile}
       */
      baseLayer: new GoogleRoadMap(),

      /**
       * @attribute zoom
       * @type {number}
       */
      zoom: 4,

      /**
       * Map-Canvas.
       *
       * @attribute el
       * @type {string|HTMLElement}
       */
      el: el
    }, opt_attrs);

    var options = _.extend({
      strategy: MapStrategy,
      validate: true
    }, opt_options);


    attrs.baseLayer.setMap(this);

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
    if (!_.isString(attrs.el) && !_.isElement(attrs.el)) {
      return new ValidationError('el', attrs.el + ' is not a valid map canvas element or id');
    }
  };

  /**
   * @method getBounds
   * @return {aeris.maps.Bounds} LatLons of SW and NE corners.
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
   * @param {aeris.maps.LatLng} latLon
   */
  Map.prototype.setCenter = function(latLon) {
    this.set('center', latLon, { validate: true });
  };


  /**
   * @method setZoom
   * @param {number} zoom
   */
  Map.prototype.setZoom = function(zoom) {
    this.set('zoom', zoom, { validate: true });
  };


  /**
   * @method setBaseLayer
   * @param {aeris.maps.layers.AbstractTile} baseLayer
   */
  Map.prototype.setBaseLayer = function(baseLayer) {
    this.set('baseLayer', baseLayer, { validate: true });
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
    if (!this.strategy_) {
      throw Error('Unable to fit to bounds: Map strategy is not yet defined');
    }

    this.strategy_.fitToBounds(bounds);
  };


  return _.expose(Map, 'aeris.maps.Map');
});
