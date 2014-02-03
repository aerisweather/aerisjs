define([
  'ai/util',
  'ai/events',
  'ai/errors/validationerror',
  'ai/maps/extension/mapextensionobject',
  'ai/maps/strategy/map',
  'ai/maps/layers/googleroadmap'
], function(_, Events, ValidationError, MapExtensionObject, MapStrategy, GoogleRoadMap) {
  /**
   * @publicApi
   * @class Map
   * @namespace aeris.maps
   * @extends aeris.maps.extensions.MapExtensionObject
   *
   * @param {Node} el Map canvas.
   * @constructor
   */
  var Map = function(el, opt_attrs, opt_options) {
    /**
     * @event click
     * @param {Array.<number>} latLon
     */
    /**
     * @event dblclick
     * @param {Array.<number>} latLon
     */
    /**
     * When base map tiles are loaded.
     * @event load
     */
    var attrs = _.extend({
      /**
       * @attribute center
       * @type {Array.<number>} LatLon coordinate.
       */
      center: [45, -90],


      /**
       * LatLon bounds of the map viewport.
       *
       * @attribute bounds
       * @type {Array.<Array.<number>>} LatLons of SW and NE corners.
       */
      bounds: [[22.43, -135.52], [52.37, -55.016]], // A rough box around the US,

      /**
       * @attribute baseLayer
       * @type {aeris.maps.AbstractTile}
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
       * @type {string|Node}
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

  Map.prototype.getBounds = function() {
    return this.get('bounds');
  };


  Map.prototype.getView = function() {
    return this.strategy_.getView();
  };


  Map.prototype.setCenter = function(latLon) {
    this.set('center', latLon, { validate: true });
  };


  Map.prototype.setZoom = function(zoom) {
    this.set('zoom', zoom, { validate: true });
  };


  Map.prototype.setBaseLayer = function(baseLayer) {
    this.set('baseLayer', baseLayer, { validate: true });
  };


  Map.prototype.fitToBounds = function(bounds) {
    if (!this.strategy_) {
      throw Error('Unable to fit to bounds: Map strategy is not yet defined');
    }

    this.strategy_.fitToBounds(bounds);
  };


  return _.expose(Map, 'aeris.maps.Map');
});
