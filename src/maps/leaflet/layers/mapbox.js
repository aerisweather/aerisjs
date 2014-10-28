define([
  'aeris/util',
  'aeris/maps/abstractstrategy',
  'leaflet',
  'mapbox'
], function(_, AbstractStrategy, Leaflet) {
  /**
   * @class aeris.maps.leaflet.layers.MapBox
   * @extends aeris.maps.AbstractStrategy
   *
   * @constructor
   */
  var MapBox = function(object, opt_options) {
    this.validateMapBoxDependencyExists_();

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
   * Usually, we would let RequireJS make sure that
   * all of our dependencies are defined. In this case, though,
   * we want to make MapBox.js an optional dependency. So rather than
   * check that it exists when the Aeris.js script loads, we're going to
   * check that it exists only when a MapBox layer is created.
   *
   * @method validateMapBoxDependencyExists_
   */
  MapBox.prototype.validateMapBoxDependencyExists_ = function() {
    if (!Leaflet.mapbox) {
      throw new Error('Aeris.js requires MapBox.js in order to use aeris.maps.layers.MapBox layers. ' +
        'See https://www.mapbox.com/mapbox.js.');
    }
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
