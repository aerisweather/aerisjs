define([
  'aeris/util',
  'aeris/maps/abstractstrategy',
  'leaflet',
  'aeris/maps/strategy/util',
  'aeris/maps/markers/stormcellmarker',
  'aeris/api/models/geojsonfeature'
], function(_, AbstractStrategy, Leaflet, MapUtil, StormCellMarker, FeatureModel) {
  /** @class StormCells */
  var StormCells = function(stormCellsMapObject) {
    AbstractStrategy.call(this, stormCellsMapObject);
  };
  _.inherits(StormCells, AbstractStrategy);


  StormCells.prototype.createView_ = function() {
    return new Leaflet.geoJson(this.object_.toGeoJson(), {
      pointToLayer: function(feature, latLng) {
        return new Leaflet.CircleMarker(latLng);
      }.bind(this),
      onEachFeature: this.initializeFeature_.bind(this)
    });
  };

  StormCells.prototype.setMap = function(map) {
    AbstractStrategy.prototype.setMap.call(this, map);

    this.view_.addTo(this.mapView_);
  };

  StormCells.prototype.beforeRemove_ = function() {
    this.mapView_.removeLayer(this.view_);
  };

  StormCells.prototype.initializeFeature_ = function(feature, layer) {
    var EventTrigger = function(eventType) {
      return function(evt) {
        this.object_.trigger(eventType, MapUtil.toAerisLatLon(evt.latlng), this.object_);
      };
    };

    // Style the layers
    var styles = this.object_.getStyle(feature.properties);
    this.setLayerStyle(layer, styles);

    // Proxy events
    layer.on({
      click: EventTrigger('click').bind(this),
      mouseover: EventTrigger('mouseover').bind(this),
      mouseout: EventTrigger('mouseout').bind(this)
    });

    // Handle hover events
    layer.on({
      mouseover: function(evt) {
        this.setLayerStyle(layer, {
          cell: styles.cell.hover,
          cone: styles.cone.hover,
          line: styles.line.hover
        });

        if (!Leaflet.Browser.ie && !Leaflet.Browser.opera) {
          // Apparently, this doesn't work in IE or Opera...
          layer.bringToFront();
        }
      }.bind(this),
      mouseout: function(evt) {
        this.setLayerStyle(layer, styles);
      }.bind(this)
    });
  };

  StormCells.prototype.setLayerStyle = function(layer, objectStyles) {
    layer.getLayers().forEach(function(layer) {
      if (layer instanceof Leaflet.CircleMarker) {
        layer.setStyle(objectStyles.cell);
      }
      else if (layer instanceof Leaflet.Polygon) {
        layer.setStyle(objectStyles.cone);
      }
      else if (layer instanceof Leaflet.Polyline) {
        layer.setStyle(objectStyles.line);
      }
    }, this);
  };

  return StormCells;
});
