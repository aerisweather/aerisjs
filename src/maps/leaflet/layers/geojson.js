define([
  'aeris/util',
  'aeris/maps/abstractstrategy',
  'leaflet',
  'aeris/maps/strategy/util'
], function(_, AbstractStrategy, Leaflet, MapUtil) {
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
    var EventTrigger = function(eventType, data) {
      return function(evt) {
        this.object_.trigger(eventType, MapUtil.toAerisLatLon(evt.latlng), this.object_, data);
      };
    };

    return new Leaflet.geoJson(this.object_.toGeoJson(), {
      style: (function(feature) {
        return this.object_.getStyle(feature.properties);
      }.bind(this)),
      clickable: this.object_.get('clickable'),
      onEachFeature: function(feature, layer) {
        var style = this.object_.getStyle(feature.properties);


        // Proxy events
        layer.on({
          click: EventTrigger('click', feature.properties).bind(this),
          mouseover: EventTrigger('mouseover', feature.properties).bind(this),
          mouseout: EventTrigger('mouseout', feature.properties).bind(this)
        });

        // Set hover styles
        layer.on({
          mouseover: function(evt) {
            layer.setStyle(style.hover);

            if (!Leaflet.Browser.ie && !Leaflet.Browser.opera) {
              // Apparently, this doesn't work in IE or Opera...
              layer.bringToFront();
            }
          }.bind(this),
          mouseout: function(evt) {
            layer.setStyle(this.object_.getStyle(feature.properties));
          }.bind(this)
        });
      }.bind(this)
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
