define([
  'aeris/util',
  'aeris/events',
  'errors/validationerror',
  'base/extension/mapextensionobject',
  'strategy/map',
  'base/layers/googleroadmap'
], function(_, Events, ValidationError, MapExtensionObject, MapStrategy, GoogleRoadMap) {
  /**
   * @class aeris.maps.Map
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
       * @type {Node}
       */
      el: el
    }, opt_attrs);

    var options = _.extend({
      strategy: MapStrategy
    }, opt_options);


    attrs.baseLayer.setMap(this);

    Events.call(this);
    MapExtensionObject.call(this, attrs, options);
  };
  _.inherits(Map, MapExtensionObject);
  _.extend(Map.prototype, Events.prototype);


  Map.prototype.validate = function(attr) {
    if (!_.isArray(attr.center)) {
      return new ValidationError('center', attr.center + ' is not a valid coordinate');
    }
    if (!_.isNumber(attr.zoom)) {
      return new ValidationError('zoom', attr.zoom + ' is not a valid zoom level');
    }
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
