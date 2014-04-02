define([
  'aeris/util',
  'aeris/maps/abstractstrategy',
  'aeris/maps/layers/osm',
  'aeris/maps/strategy/util',
  'leaflet'
], function(_, AbstractStrategy, OSMLayer, mapUtil, Leaflet) {
  /**
   * A map rendering strategy using Leaflet.
   *
   * @class Map
   * @namespace aeris.maps.leaflet
   * @extends aeris.maps.strategy.AbstractStrategy
   *
   * @constructor
   */
  var LeafletMapStrategy = function(aerisMap) {
    AbstractStrategy.call(this, aerisMap);

    /**
     * @property object_
     * @private
     * @type {aeris.maps.Map}
     * @override
     */
    /**
     * @property view_
     * @private
     * @type {L.Map}
     * @override
     */

    this.updateLeafletMapPosition_();
    this.updateAerisMapPosition_();

    this.proxyLeafletMapEvents_();
    this.bindToLeafletMapState_();
  };
  _.inherits(LeafletMapStrategy, AbstractStrategy);


  /**
   * @method createView_
   * @private
   * @override
   *
   * @return {L.Map}
   */
  LeafletMapStrategy.prototype.createView_ = function() {
    var map;
    var el = this.object_.getElement();

    // Use predefined map view
    if (el instanceof Leaflet.Map) {
      return el;
    }

    map = new Leaflet.Map(el);

    // Add a baseLayer to the map.
    var baseLayer = new OSMLayer();
    baseLayer.getView().addTo(map);

    return map;
  };


  /**
   * @method updateLeafletMapPosition_
   * @private
   */
  LeafletMapStrategy.prototype.updateLeafletMapPosition_ = function() {
    this.view_.setView(this.object_.getCenter(), this.object_.getZoom());
  };


  /**
   * @method updateAerisMapPosition_
   * @private
   */
  LeafletMapStrategy.prototype.updateAerisMapPosition_ = function() {
    this.object_.set({
      center: mapUtil.toAerisLatLon(this.view_.getCenter()),
      bounds: mapUtil.toAerisBounds(this.view_.getBounds()),
      zoom: this.view_.getZoom()
    }, { validate: true });
  };


  /**
   * @method proxyLeafletMapEvents_
   * @private
   */
  LeafletMapStrategy.prototype.proxyLeafletMapEvents_ = function() {
    this.proxyLeafletMouseEvent_('click');
    this.proxyLeafletMouseEvent_('dblclick');

    this.view_.addEventListener({
      load: function() {
        this.object_.trigger('load');
      }.bind(this)
    });
  };

  /**
   * @param {string} leafletTopic
   * @param {string=} opt_aerisTopic
   * @private
   */
  LeafletMapStrategy.prototype.proxyLeafletMouseEvent_ = function(leafletTopic, opt_aerisTopic) {
    var aerisTopic = opt_aerisTopic || leafletTopic;

    this.view_.addEventListener(leafletTopic, function(evt) {
      var latLon = mapUtil.toAerisLatLon(evt.latlng);
      this.object_.trigger(aerisTopic, latLon);
    }.bind(this));
  };


  /**
   * @method bindToLeafletMapState_
   * @private
   */
  LeafletMapStrategy.prototype.bindToLeafletMapState_ = function() {
    this.view_.addEventListener({
      moveend: this.updateAerisMapPosition_.bind(this)
    });

    this.listenTo(this.object_, {
      'change:center change:zoom': this.updateLeafletMapPosition_
    });
  };


  /**
   * @method fitToBounds
   * @param {aeris.maps.Bounds} bounds
   */
  LeafletMapStrategy.prototype.fitToBounds = function(bounds) {
    this.view_.fitBounds(mapUtil.toLeafletBounds(bounds));
  };


  return LeafletMapStrategy;
});
