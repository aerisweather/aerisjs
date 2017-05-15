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
    var mapType = new this.MapType_({
      getTileUrl: _.bind(this.getUrl_, this),
      tileSize: new gmaps.Size(256, 256),
      minZoom: this.object_.get('minZoom'),
      maxZoom: this.object_.get('maxZoom'),
      name: this.object_.get('name') || 'Aeris Weather Layer',
      opacity: this.object_.get('opacity')
    });
    return mapType;
  };


  TileLayerStrategy.prototype.delegateMapEvents_ = function() {
    this.googleEvents_.listenTo(this.mapView_, 'bounds_changed', function() {
      this.object_.trigger('load:reset');
    }, this);

    this.googleEvents_.listenTo(this.mapView_, 'tilesloaded', function() {
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

    // Assign `aerisZIndex` prop to the view,
    // so we can manually rearrange layers against one another.
    // (gmaps does not support a `setZIndex` method)
    this.getView().aerisZIndex = this.object_.get('zIndex');

    // If there's no map assigned to this layer,
    // we can't do anything here
    if (!this.object_.getMap()) {
      return;
    }

    // Find all tile layer views
    var mapView = this.object_.getMap().getView();

    // Sort the layer views in place
    // so we don't have to re-render
    // https://en.wikipedia.org/wiki/Selection_sort
    var views = mapView.overlayMapTypes.getArray();
    var viewsLength = views.length;
    for (var iPointer = 0; iPointer < viewsLength - 1; iPointer++) {
      // Find the index of any view
      // with a lower zIndex than the pointer view
      var iMin = iPointer;
      for (var i = iPointer + 1; i < viewsLength; i++) {
        if (views[i].aerisZIndex < views[iMin].aerisZIndex) {
          iMin = i;
        }
      }

      var minView = views[iMin];
      var pointerView = views[iPointer];
      if (
        iMin !== iPointer &&
        'aerisZIndex' in minView &&
        'aerisZIndex' in pointerView
      ) {
        // Put minView where pointerView was
        mapView.overlayMapTypes.setAt(iPointer, minView);

        // Put pointerView where minView was
        mapView.overlayMapTypes.setAt(iMin, pointerView);
      }
    }
  };

  return TileLayerStrategy;
});
