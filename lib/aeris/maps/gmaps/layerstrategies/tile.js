define([
  'aeris/util',
  'strategy/layerstrategies/abstractmaptype',
  'strategy/layerstrategies/maptype/imagemaptype'
], function(_, BaseLayerStrategy, ImageMapType) {
  /**
   *
   * @param {aeris.maps.AbstractTile} layer
   * @extends aeris.maps.gmaps.layerstrategies.AbstractMapTypeStrategy
   * @class aeris.maps.gmaps.layerstrategies.TileLayerStrategy
   * @constructor
   */
  var TileLayerStrategy = function(layer, opt_options) {
    var options = _.extend({
      MapType: ImageMapType
    }, opt_options)

    this.MapType_ = options.MapType;

    BaseLayerStrategy.apply(this, arguments);

    this.layer_.on({
      'change:opacity': this.setOpacity_,
      'change:zIndex': this.setZIndex_
    }, this);
    this.setOpacity_();
  };

  _.inherits(TileLayerStrategy, BaseLayerStrategy);


  /**
   * @override
   */
  TileLayerStrategy.prototype.createView_ = function() {
    var mapTypeOptions = this.getMapTypeOptions_();

    this.view_ = new this.MapType_(mapTypeOptions);

    this.proxyViewEvents_();

    return this.view_;
  };


  /**
   * Proxy events fired by the {google.maps.ImageMapType}
   * object, so that they fire on the {aeris.maps.AbstractTile} layer.
   * @private
   */
  TileLayerStrategy.prototype.proxyViewEvents_ = function() {
    var self = this;

    google.maps.event.addListener(this.getView(), 'tilesloaded', function() {
      self.layer_.trigger('load');
    });
  };


  TileLayerStrategy.prototype.delegateMapEvents_ = function() {
    google.maps.event.addListener(this.mapView_, 'bounds_changed', _.bind(function() {
      this.layer_.trigger('load:reset');
    }, this));

    google.maps.event.addListener(this.mapView_, 'zoom_changed', _.bind(function() {
      this.layer_.trigger('load:reset');
    }, this));

    BaseLayerStrategy.prototype.delegateMapEvents_.apply(this, arguments);
  };


  /**
   * @return {google.maps.ImageMapTypeOptions}
   *
   * @private
   */
  TileLayerStrategy.prototype.getMapTypeOptions_ = function() {
    return {
      getTileUrl: _.bind(this.getUrl_, this),
      tileSize: new google.maps.Size(256, 256),
      minZoom: this.layer_.get('minZoom'),
      maxZoom: this.layer_.get('maxZoom'),
      name: this.layer_.get('name'),
      opacity: this.layer_.get('opacity'),
      zIndex: this.layer_.get('zIndex')
    };
  };


  /**
   * Method called by google, to
   * retreive the url for a tile at a
   * given map coordinate and zoom level.
   *
   * @param {google.maps.Point} coord
   * @param {number} zoom Zoom level.
   * @return {string} Tile image url.
   *
   * @private
   */
  TileLayerStrategy.prototype.getUrl_ = function(coord, zoom) {
    var zfactor = this.layer_.zoomFactor(zoom);
    var subdomain = this.layer_.getRandomSubdomain();

    var url = this.layer_.getUrl();
    url = url.replace(/\{d\}/, subdomain).
              replace(/\{z\}/, zfactor).
              replace(/\{x\}/, coord.x).
              replace(/\{y\}/, coord.y);

    return url;
  };


  /**
   * Set the opacity of the layer
   */
  TileLayerStrategy.prototype.setOpacity_ = function() {
    var opacity = this.layer_.get('opacity');
    this.getView().setOpacity(opacity);
  };


  TileLayerStrategy.prototype.setZIndex_ = function() {
    var zIndex = this.layer_.get('zIndex');
    this.getView().setZIndex(zIndex);
  };

  return TileLayerStrategy;
});
