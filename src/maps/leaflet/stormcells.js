define([
  'aeris/util',
  'aeris/maps/abstractstrategy',
  'leaflet',
  'aeris/maps/strategy/util'
], function(_, AbstractStrategy, Leaflet, MapUtil) {
  /** @class StormCells */
  var StormCells = function(stormCellsMapObject) {
    AbstractStrategy.call(this, stormCellsMapObject);

    this.listenTo(this.object_, {
      'add remove reset change': _.debounce(this.update_, 250, {
        leading: false
      })
    });
  };
  _.inherits(StormCells, AbstractStrategy);


  StormCells.prototype.createView_ = function() {
    return new Leaflet.geoJson(this.object_.toGeoJson(), {
      pointToLayer: function(feature, latLng) {
        return new Leaflet.CircleMarker(latLng);
      }.bind(this),
      onEachFeature: function(feature, layer) {
        var EventTrigger = function(eventType) {
          return function(evt) {
            this.trigger(eventType, MapUtil.toAerisLatLon(evt.latlng), feature);
          };
        };
        layer.on({
          click: EventTrigger('click').bind(this),
          mouseover: EventTrigger('mouseover').bind(this),
          mouseout: EventTrigger('mouseout').bind(this)
        });
      }.bind(this)
    });
  };

  StormCells.prototype.update_ = function() {
    this.view_.clearLayers();
    this.view_.addData(this.object_.toGeoJson());
  };

  StormCells.prototype.setMap = function(map) {
    AbstractStrategy.prototype.setMap.call(this, map);

    this.view_.addTo(this.mapView_);
  };

  StormCells.prototype.beforeRemove_ = function() {
    this.mapView_.removeLayer(this.view_);
  };

  return StormCells;
});
