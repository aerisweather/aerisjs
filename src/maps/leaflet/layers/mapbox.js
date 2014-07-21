define([
  'aeris/util',
  'aeris/maps/abstractstrategy',
  'leaflet',
  'mapbox'
], function(_, AbstractStrategy, Leaflet) {
  /**
   * @class MapBox
   * @namespace aeris.maps.leaflet.layers
   * @extends aeris.maps.AbstractStrategy
   *
   * @constructor
   */
  var MapBox = function(object, opt_options) {
    AbstractStrategy.call(this, object, opt_options);
  };
  _.inherits(MapBox, AbstractStrategy);


  /**
   * @method createView_
   * @private
   */
  MapBox.prototype.createView_ = function() {
    var mapBoxId = this.object_.get('mapBoxId');
    return new Leaflet.mapbox.TileLayer(mapBoxId);
  };


  /**
   * @method setMap
   */
  MapBox.prototype.setMap = function(map) {
    AbstractStrategy.prototype.setMap.call(this, map);

    this.view_.addTo(map.getView());
  };


  /**
   * @method beforeRemove_
   * @private
   */
  MapBox.prototype.beforeRemove_ = function() {
    this.mapView_.removeLayer(this.view_);
  };


  return MapBox;
});
