define([
  'aeris/util',
  'aeris/maps/abstractstrategy',
  'aeris/maps/strategy/util',
  'leaflet'
], function(_, AbstractStrategy, mapUtil, Leaflet) {
  /**
   * A strategy for rendering a marker using Leaflet.
   *
   * @class Marker
   * @namespace aeris.maps.leaflet.markers
   * @extends aeris.maps.AbstractStrategy
   *
   * @constructor
   */
  var MarkerStrategy = function(mapObject) {
    AbstractStrategy.call(this, mapObject);

    this.bindMarkerAttributes_();
    this.proxyMarkerEvents_();
  };
  _.inherits(MarkerStrategy, AbstractStrategy);


  /**
   * @method createView_
   * @private
   */
  MarkerStrategy.prototype.createView_ = function() {
    var latLng = mapUtil.toLeafletLatLng(this.object_.getPosition());
    return new Leaflet.Marker(latLng, {
      icon: this.createIcon_(),
      clickable: this.object_.get('clickable'),
      draggable: this.object_.get('draggable'),
      title: this.object_.get('title'),
      alt: this.object_.get('title')
    });
  };


  /**
   * @method setMap
   */
  MarkerStrategy.prototype.setMap = function(map) {
    AbstractStrategy.prototype.setMap.call(this, map);

    this.view_.addTo(this.mapView_);
  };


  /**
   * @method beforeRemove_
   * @private
   */
  MarkerStrategy.prototype.beforeRemove_ = function() {
    this.mapView_.removeLayer(this.view_);
  };


  /**
   * @method createIcon_
   * @private
   * @return {L.Icon}
   */
  MarkerStrategy.prototype.createIcon_ = function() {
    return new Leaflet.Icon({
      iconUrl: this.getMarkerUrl_(),
      iconAnchor: this.createOffsetPoint_()
    });
  };


  /**
   * Create a Leafet Point object corresponding
   * to the marker's current offset attributes.
   *
   * @method createOffsetPoint_
   * @private
   * @return {L.Point}
   */
  MarkerStrategy.prototype.createOffsetPoint_ = function() {
    var offset = this.object_.isSelected() ?
      [this.object_.get('selectedOffsetX'), this.object_.get('selectedOffsetY')] :
      [this.object_.get('offsetX'), this.object_.get('offsetY')];

    return Leaflet.point.apply(Leaflet.point, offset);
  };


  /**
   * @method getMarkerUrl_
   * @private
   */
  MarkerStrategy.prototype.getMarkerUrl_ = function() {
    return this.object_.isSelected() ?
      this.object_.getSelectedUrl() :
      this.object_.getUrl();
  };


  /**
   * @method bindMarkerAttributes_
   * @private
   */
  MarkerStrategy.prototype.bindMarkerAttributes_ = function() {
    var iconChangeEvents = [
      'change:url',
      'change:offsetX',
      'change:offsetY',
      'change:selectedUrl',
      'change:selectedOffsetX',
      'change:selectedOffsetY',
      'change:selected'
    ];
    var objectEvents = {
      'change:position': function() {
        var latLng = mapUtil.toLeafletLatLng(this.object_.getPosition());
        this.view_.setLatLng(latLng);
      }
    };

    objectEvents[iconChangeEvents.join(' ')] = function() {
      this.view_.setIcon(this.createIcon_());
    };

    this.listenTo(this.object_, objectEvents);

    this.view_.addEventListener({
      'move dragend': function() {
        var latLon = mapUtil.toAerisLatLon(this.view_.getLatLng());
        this.object_.setPosition(latLon);
      }
    }, this);
  };


  /**
   * @method proxyMarkerEvents_
   * @private
   */
  MarkerStrategy.prototype.proxyMarkerEvents_ = function() {
    this.view_.addEventListener({
      click: function(evt) {
        var latLon = mapUtil.toAerisLatLon(evt.latlng);
        this.object_.trigger('click', latLon, this.object_);
      },
      dragend: function() {
        // Leaflet dragend evt does not provide latLng
        var latLon = this.object_.getPosition();
        this.object_.trigger('dragend', latLon, this.object_);
      }
    }, this);
  };


  return MarkerStrategy;
});
