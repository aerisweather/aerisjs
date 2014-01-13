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

    this.listenTo(this.object_, {
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

    this.googleEvents_.listenTo(this.getView(), 'tilesloaded', function() {
      this.object_.trigger('load');
    }, this);
  };


  TileLayerStrategy.prototype.delegateMapEvents_ = function() {
    this.googleEvents_.listenTo(this.mapView_, 'bounds_changed', function() {
      this.object_.trigger('load:reset');
    }, this);

    this.googleEvents_.listenTo(this.mapView_, 'zoom_changed', function() {
      this.object_.trigger('load:reset');
    }, this);

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
      minZoom: this.object_.get('minZoom'),
      maxZoom: this.object_.get('maxZoom'),
      name: this.object_.get('name'),
      opacity: this.object_.get('opacity'),
      zIndex: this.object_.get('zIndex')
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
    var url;
    var zfactor = this.object_.zoomFactor(zoom);
    var subdomain = this.object_.getRandomSubdomain();
    var normalizedCoord = this.getNormalizedCoord_(coord, zoom);

    if (!normalizedCoord) { return null; }

    url = this.object_.getUrl();
    url = url.replace(/\{d\}/, subdomain).
              replace(/\{z\}/, zfactor).
              replace(/\{x\}/, normalizedCoord.x).
              replace(/\{y\}/, normalizedCoord.y);

    return url;
  };


  /**
   * Normalize to prevent negative coordinates.
   * Thanks to http://stackoverflow.com/questions/13121455/google-maps-maptype-coordinates/13124782#13124782
   *
   * @param {Object} coord
   * @param {number} zoom
   * @return {number}
   * @private
   */
  TileLayerStrategy.prototype.getNormalizedCoord_ = function(coord, zoom) {
    var dim = Math.pow(2, zoom);

    if (coord.y < 0) { return null; }

    coord = {
      x: Math.abs(coord.x) % dim,
      y: Math.abs(coord.y) % dim
    };

    return coord;
  };


  /**
   * Set the opacity of the layer
   */
  TileLayerStrategy.prototype.setOpacity_ = function() {
    var opacity = this.object_.get('opacity');
    this.getView().setOpacity(opacity);
  };


  TileLayerStrategy.prototype.setZIndex_ = function() {
    var zIndex = this.object_.get('zIndex');
    this.getView().setZIndex(zIndex);
  };

  return TileLayerStrategy;
});
