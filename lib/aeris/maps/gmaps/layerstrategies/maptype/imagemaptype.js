define([
  'ai/util',
  'ai/maps/strategy/layerstrategies/maptype/imagemaptypeeventhub',
  'googlemaps!'
], function(_, mapTypeEventHub, gmaps) {
  /**
   * Similar to a {google.maps.ImageMapType}
   * but with some additional functionality.
   *
   * See https://developers.google.com/maps/documentation/javascript/reference#ImageMapTypeOptions
   *  for additional parameter options.
   *
   * @class aeris.maps.gmaps.layerstrategies.maptype.ImageMapType
   * @implements google.maps.MapType
   *
   * @param {Object} options
   * @param {number=} options.zIndex Optional.
   * @param {number=} options.opacity Optional.
   * @param {Function} options.getTileUrl Required.
   * @param {google.maps.Size} options.tileSize Required.
   *
   * @constructor
   */
  var ImageMapType = function(options) {
    _.defaults(options, {
      zIndex: 1,
      opacity: 1,
      tileSize: new gmaps.Size(256, 256)
    });

    _.extend(this, _.pick(options, [
      'alt',
      'maxZoom',
      'minZoom',
      'name',
      'projection',
      'radius',
      'tileSize'
    ]));


    /**
     * See {google.maps.ImageMapType#getTileUrl}
     * @type {Function}
     */
    this.getTileUrl_ = options.getTileUrl;


    /**
     * @type {Array.<Node>}
     * @private
     */
    this.divs_ = [];


    /**
     * Images created for each tile.
     *
     * @type {Array.<Node>}
     * @private
     */
    this.imgs_ = [];


    /**
     * Loaded image elements.
     * A subset of this.imgs_
     *
     * @type {Array.<Node>}
     * @private
     */
    this.loadedImgs_ = [];


    /**
     * @type {number}
     * @private
     */
    this.zIndex_ = options.zIndex;


    /**
     * @type {number}
     * @private
     */
    this.opacity_ = options.opacity;


    // Update our zIndex
    // whenever any other ImageMapType
    // changes theres.
    // This seems to be necessary for
    // gmaps to save our zIndex state.
    mapTypeEventHub.on('zIndex:update', function(imageMapType) {
      if (imageMapType !== this) {
        // Reset our zIndex.
        // Don't trigger the event again,
        // or we'll create an endless loop.
        this.setZIndex(this.zIndex_, { trigger: false });
      }
    }, this);
  };

  /**
   * @override
   * @param {Object} coord
   * @param {number} zoom
   * @param {HTMLElement} ownerDocument
   * @returns {HTMLElement}
   */
  ImageMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
    var tileSrc, img, tileContainer;

    coord = this.getNormalizedCoord_(coord, zoom);

    tileContainer = this.createTileContainer_(ownerDocument);

    if (coord) {
      tileSrc = this.getTileUrl_(coord, zoom);

      img = this.createTileImage_(ownerDocument, tileSrc);

      img.onload = _.bind(function() {
        this.addLoadedImage_(img);
      }, this);


      this.setOpacity(this.opacity_);

      tileContainer.appendChild(img);

      this.imgs_.push(img);
    }

    this.setZIndex(this.zIndex_);

    // Keep track of the element,
    // so we can manipulate it later.
    this.divs_.push(tileContainer);


    return tileContainer;
  };

  /**
   * Normalize to keep coordinates in bounds of map tile range.
   *
   * See https://developers.google.com/maps/documentation/javascript/examples/maptype-image?csw=1
   *
   * @param {Object} coord
   * @param {number} zoom
   * @return {number}
   * @private
   */
  ImageMapType.prototype.getNormalizedCoord_ = function(coord, zoom) {
    var y = coord.y;
    var x = coord.x;

    // tile range in one direction range is dependent on zoom level
    // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
    var tileRange = 1 << zoom;

    // don't repeat across y-axis (vertically)
    if (y < 0 || y >= tileRange) {
      return null;
    }

    // repeat across x-axis
    if (x < 0 || x >= tileRange) {
      x = (x % tileRange + tileRange) % tileRange;
    }

    return {
      x: x,
      y: y
    };
  }


  /**
   * @private
   * @param {HTMLElement} ownerDocument
   * @return {HTMLElement}
   */
  ImageMapType.prototype.createTileContainer_ = function(ownerDocument) {
    var div = ownerDocument.createElement('div');

    div.style.width = this.tileSize.width + 'px';
    div.style.height = this.tileSize.height + 'px';
    div.style.opacity = this.opacity_;

    return div;
  };


  /**
   * @private
   * @param {HTMLElement} ownerDocument
   * @param {string} imageSrc
   * @return {HTMLElement}
   */
  ImageMapType.prototype.createTileImage_ = function(ownerDocument, imageSrc) {
    var img;

    if (!imageSrc) {
      throw new Error('Unable to create tile image: ' + imageSrc + ' is not a valid ' +
        'tile image source.');
    }

    img = ownerDocument.createElement('img');

    img.style.width = '100%';
    img.style.height = '100%';
    img.setAttribute('src', imageSrc);

    return img;
  };


  /** @private */
  ImageMapType.prototype.addLoadedImage_ = function(img) {
    this.loadedImgs_.push(img);
    if (this.imgs_.length === this.loadedImgs_.length) {
      gmaps.event.trigger(this, 'tilesloaded');
    }
  };


  /**
   * Returns the parent node of the
   * entire map type. The siblings of this
   * node are other map types.
   *
   * Note that this method is fragile,
   * as it relies on an undocumented google maps
   * DOM structure. Whenever possible,
   * it's probably better to avoid using this method,
   * and directly interface with this.divs_, instead.
   *
   * @private
   * @return {?HTMLElement}
   */
  ImageMapType.prototype.getParentNode_ = function() {
    try {
      return this.divs_[0].parentNode.parentNode;
    }
    catch (e) {
      return null;
    }
  };


  ImageMapType.prototype.setZIndex = function(zIndex, opt_options) {
    var options = _.extend({
      trigger: true
    }, opt_options);

    // Save our new zIndex state.
    this.zIndex_ = zIndex;

    if (this.getParentNode_()) {
      this.getParentNode_().style.zIndex = zIndex;
    }

    // Tell everyone that we updated our zIndex,
    // so they can update their too.
    //
    // Otherwise, google seems to overwrite zIndexes.
    if (options.trigger) {
      mapTypeEventHub.trigger('zIndex:update', this, zIndex);
    }
  };


  ImageMapType.prototype.releaseTile = function(div) {
    this.divs_ = _.without(this.divs_, div);
    this.imgs_ = _.without(this.imgs_, div.getElementsByTagName('img'));
    this.loadedImgs_ = _.without(this.imgs_, div.getElementsByTagName('img'));
  };


  ImageMapType.prototype.setOpacity = function(opacity) {
    this.opacity_  = opacity;

    _.each(this.divs_, function(div) {
      div.style.opacity = this.opacity_;
    }, this);
  };


  return ImageMapType;
});
