define([
  'aeris/util',
  'aeris/maps/strategy/layers/abstractmaptype',
  'aeris/maps/strategy/layers/maptype/imagemaptype',
  'googlemaps!'
], function(_, BaseLayerStrategy, ImageMapType, gmaps) {
  /**\
   * @class aeris.maps.gmaps.layers.TileLayerStrategy
   * @extends aeris.maps.gmaps.layers.AbstractMapTypeStrategy
   *
   * @constructor
   * @param {aeris.maps.layers.AbstractTile} layer
   */
  var TileLayerStrategy = function(layer, opt_options) {
    var options = _.extend({
      MapType: ImageMapType
    }, opt_options);

    this.MapType_ = options.MapType;

    BaseLayerStrategy.apply(this, arguments);

    this.listenTo(this.object_, {
      'change:opacity': this.updateOpacity,
      'change:zIndex': this.updateZIndex_
    }, this);
    this.updateOpacity();
  };

  _.inherits(TileLayerStrategy, BaseLayerStrategy);


  /**
   * @method createView_
   */
  TileLayerStrategy.prototype.createView_ = function() {
    var mapTypeOptions = this.getMapTypeOptions_();

    this.view_ = new this.MapType_(mapTypeOptions);

    return this.view_;
  };


  TileLayerStrategy.prototype.delegateMapEvents_ = function() {
    this.googleEvents_.listenTo(this.mapView_, 'bounds_changed', function() {
      this.object_.trigger('load:reset');

      // Map view fires 'idle' event when all layers are loaded.
      google.maps.event.addListenerOnce(this.mapView_, 'idle', function() {
        this.object_.trigger('load');
      }.bind(this));
    }, this);

    this.googleEvents_.listenTo(this.getView(), 'load', function() {
      this.object_.trigger('load');
    }, this);

    BaseLayerStrategy.prototype.delegateMapEvents_.apply(this, arguments);
  };


  /**
   * @return {google.maps.ImageMapTypeOptions}
   *
   * @private
   * @method getMapTypeOptions_
   */
  TileLayerStrategy.prototype.getMapTypeOptions_ = function() {
    return {
      getTileUrl: _.bind(this.getUrl_, this),
      tileSize: new gmaps.Size(256, 256),
      minZoom: this.object_.get('minZoom'),
      maxZoom: this.object_.get('maxZoom'),
      name: this.object_.get('name') || 'Aeris Weather Layer',
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
   * @method getUrl_
   */
  TileLayerStrategy.prototype.getUrl_ = function(coord, zoom) {
    var url;
    var zfactor = this.object_.zoomFactor(zoom);
    var subdomain = this.object_.getRandomSubdomain();

    url = this.object_.getUrl();
    url = url.replace(/\{d\}/, subdomain).
              replace(/\{z\}/, zfactor).
              replace(/\{x\}/, coord.x).
              replace(/\{y\}/, coord.y);

    return url;
  };


  /**
   * Set the opacity of the layer
   * @method updateOpacity
   */
  TileLayerStrategy.prototype.updateOpacity = function() {
    var opacity = this.object_.get('opacity');
    this.getView().setOpacity(opacity);
  };


  TileLayerStrategy.prototype.updateZIndex_ = function() {
    var zIndex = this.object_.get('zIndex');
    this.getView().setZIndex(zIndex);
  };

  return TileLayerStrategy;
});
