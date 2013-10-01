define([
  'aeris/util',
  'openlayers/utils',
  'strategy/layerstrategies/abstractlayerstrategy'
], function(_, mapUtil, AbstractLayerStrategy) {
  var AerisPolygonStrategy = function(layer) {
    AbstractLayerStrategy.call(this, layer);
  };
  _.inherits(AerisPolygonStrategy, AbstractLayerStrategy);


  AerisPolygonStrategy.prototype.createView_ = function() {
    var polygonView = new OpenLayers.Layer.Vector('aerisPolygons');

    this.layer_.fetch({ decoded: true }).done(function(data) {
      var polygonFeatures = [];

      _.each(data.groups, function(group) {

        _.each(group.polygons, function(polygon) {
          var polyline = polygon.points;
          var ring, feature;
          var points = [];

          _.each(polyline, function(point) {
            var pointView = new OpenLayers.Geometry.Point(point[1], point[0]);
            pointView.transform(
              new OpenLayers.Projection('EPSG:4326'),
              new OpenLayers.Projection('EPSG:900913')
            );
            points.push(pointView);
          }, this);

          ring = new OpenLayers.Geometry.LinearRing(points);
          feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Polygon([ring]),
            null,
            this.layer_.get('styles')[group.value]
          );
          polygonFeatures.push(feature);
        }, this);

      }, this);

      polygonView.addFeatures(polygonFeatures);
      if (this.mapView_) {
        this.mapView_.addLayer(this.getView());
      }
    }, this);

    return polygonView;
  };


  return AerisPolygonStrategy;
});
