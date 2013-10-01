define([
  'aeris/util',
  'aeris/events',
  'base/extension/mapextensionobject',
  'strategy/map',
  'base/layers/googleroadmap'
], function(_, Events, MapExtensionObject, MapStrategy, GoogleRoadMap) {
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
      center: [45, -90],
      zoom: 4,
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


  return _.expose(Map, 'aeris.maps.Map');
});
