define([
  'aeris/util',
  'aeris/maps/strategy/layers/abstractmaptype',
  'googlemaps!'
], function(_, AbstractMapTypeStrategy, gmaps) {
  /**\
   * @class aeris.maps.gmaps.layers.TileLayerStrategy
   * @extends aeris.maps.gmaps.layers.AbstractMapTypeStrategy
   *
   * @constructor
   * @param {aeris.maps.layers.AbstractTile} layer
   */
  var TileLayerStrategy = function(layer, opt_options) {
    var options = _.extend({
      MapType: gmaps.ImageMapType
    }, opt_options);

    this.MapType_ = options.MapType;

    AbstractMapTypeStrategy.apply(this, arguments);

    this.listenTo(this.object_, {
      'change:opacity': this.updateOpacity,
      'change:zIndex': this.updateZIndex_,
      // zIndex can only be applied when we have a map set,
      // so when a map is set, make sure zIndex is rendered properly
      'map:set': this.updateZIndex_
    }, this);
    this.updateOpacity();


    // gmaps does not support a `setZIndex` method,
    // so we have to do some funky stuff to get zIndex to work.
    // Make sure that funky stuff is initialized
    this.updateZIndex_();
  };

  _.inherits(TileLayerStrategy, AbstractMapTypeStrategy);


  /**
   * @method createView_
   */
  TileLayerStrategy.prototype.createView_ = function() {
    return new this.MapType_({
      getTileUrl: _.bind(this.getUrl_, this),
      tileSize: new gmaps.Size(256, 256),
      minZoom: this.object_.get('minZoom'),
      maxZoom: this.object_.get('maxZoom'),
      name: this.object_.get('name') || 'Aeris Weather Layer',
      opacity: this.object_.get('opacity')
    });
  };


  TileLayerStrategy.prototype.delegateMapEvents_ = function() {
    this.googleEvents_.listenTo(this.mapView_, 'bounds_changed', function() {
      this.object_.trigger('load:reset');

      // Map view fires 'idle' event when all layers are loaded.
      google.maps.event.addListenerOnce(this.mapView_, 'idle', function() {
        // TODO: this is firing immediatlely for layers,
        // before their first load event
        //this.object_.trigger('load');
      }.bind(this));
    }, this);

    this.googleEvents_.listenTo(this.getView(), 'load', function() {
      console.log('google-tile-view.load');
      this.object_.trigger('load');
    }, this);

    AbstractMapTypeStrategy.prototype.delegateMapEvents_.apply(this, arguments);
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


  TileLayerStrategy.prototype.updateZIndex_ = function () {
    var zIndex = this.object_.get('zIndex');
    console.log(`updateZIndex for ${this.object_.get('tileType')}: ${zIndex}`);

    // Assign `aerisZIndex` prop to the view,
    // so we can manually rearrange layers against one another.
    // (gmaps does not support a `setZIndex` method)
    this.getView().aerisZIndex = this.object_.get('zIndex');

    // If there's no map assigned to this layer,
    // we can't do anything here
    if (!this.object_.getMap()) {
      console.log(`${this.object_.get('tileType')} DOES NOT have map`);
      return;
    }
    console.log(`${this.object_.get('tileType')} has map`);

    // Find all tile layer views
    var mapView = this.object_.getMap().getView();
    var zIndexableViews = mapView.overlayMapTypes
      .getArray()
      .filter(function(view) { return 'aerisZIndex' in view; });

    // Remove all layer views from the map view
    mapView.overlayMapTypes.clear();

    // Add them all back, in order
    var sortedViews = _.sortBy(zIndexableViews, function(v) {
      return v.aerisZIndex;
    });
    sortedViews
      .forEach(function(view) {
        mapView.overlayMapTypes.push(view);
      });

  };

  return TileLayerStrategy;
});
