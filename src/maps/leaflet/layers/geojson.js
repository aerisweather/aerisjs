define([
  'aeris/util',
  'aeris/maps/abstractstrategy',
  'leaflet'
], function(_, AbstractStrategy, Leaflet) {
  /** @class GeoJson */
  var GeoJson = function(mapObject) {
    AbstractStrategy.call(this, mapObject);

    this.listenTo(this.object_, {
      'change:geoJson': _.throttle(function() {
        this.view_.clearLayers();
        this.view_.addData(this.object_.toGeoJson());
      }, 100)
    });
  };
  _.inherits(GeoJson, AbstractStrategy);

  GeoJson.prototype.createView_ = function() {
    return new Leaflet.geoJson(this.object_.toGeoJson(), {
      style: (function(feature) {
        return this.object_.getStyle(feature.properties);
      }.bind(this)),
      clickable: this.object_.get('clickable')
    });
  };

  GeoJson.prototype.setMap = function(map) {
    AbstractStrategy.prototype.setMap.call(this, map);

    this.view_.addTo(this.mapView_);
  };

  GeoJson.prototype.beforeRemove_ = function() {
    this.mapView_.removeLayer(this.view_);
  };

  return GeoJson;
});
