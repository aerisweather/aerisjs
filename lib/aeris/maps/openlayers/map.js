define([
  'aeris/util',
  'openlayers/utils',
  'base/abstractstrategy'
], function(_, mapUtil, AbstractStrategy) {
  /**
   * A strategy for rendering an OpenLayers map.
   *
   * @param {aeris.maps.Map} mapObject
   * @class aeris.maps.openlayers.MapStrategy
   * @extends aeris.maps.AbstractStrategy
   * @constructor
   */
  var OpenLayersMapStrategy = function(mapObject) {
    AbstractStrategy.apply(this, arguments);

    this.object_.on({
      'change:center': this.setCenter_,
      'change:zoom': this.setZoom_
    }, this);

    // OpenLayers needs a layer set to zoom,
    // And our layer is set asynchronously,
    // so we wait for the layer to load before zooming.
    // Does cause a little glitch in loading.
    this.getView().events.register('changebaselayer', this, this.setZoom_);

    this.proxyLoadEvent_();
  };
  _.inherits(OpenLayersMapStrategy, AbstractStrategy);


  OpenLayersMapStrategy.prototype.createView_ = function() {
    return new OpenLayers.Map(this.object_.get('el'), {
      center: mapUtil.arrayToLonLat(this.object_.get('center'))
    });
  };


  /**
   * @private
   */
  OpenLayersMapStrategy.prototype.setCenter_ = function() {
    var center = mapUtil.arrayToLonLat(this.object_.get('center'));
    this.getView().setCenter(center);
  };


  OpenLayersMapStrategy.prototype.setZoom_ = function() {
    var zoom = this.object_.get('zoom');
    this.getView().zoomTo(zoom);
  };


  /**
   * Triggers the 'load' even on the map object
   * when the OL Map view has finished loading.
   *
   * @private
   */
  OpenLayersMapStrategy.prototype.proxyLoadEvent_ = function() {
    var layerCallback = function(event) {
      event.object.events.unregister('loadend', this, layerCallback);
      this.getView().events.unregister('changebaselayer', this, mapCallback);
      this.object_.trigger('load');
    };
    var mapCallback = function(event) {
      if (event.layer.name.match(/Google/)) {
        this.getView().events.unregister('changebaselayer', this, mapCallback);
        this.object_.trigger('load');
      }
      event.layer.events.register('loadend', this, layerCallback);
    };
    this.getView().events.register('changebaselayer', this, mapCallback);
  };


  return OpenLayersMapStrategy;
});
