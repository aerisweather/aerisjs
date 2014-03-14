define([
  'aeris/util',
  'aeris/maps/strategy/layers/maptype/imagemaptypeeventhub',
  'googlemaps!'
], function(_, mapTypeEventHub, gmaps) {
  /**
   * Similar to a {google.maps.ImageMapType}
   * but with some additional functionality.
   *
   * See https://developers.google.com/maps/documentation/javascript/reference#ImageMapTypeOptions
   *  for additional parameter options.
   *
   * @class ImageMapType
   * @namespace aeris.maps.gmaps.layers.maptype
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
     * See {google.maps.ImageMapType}#getTileUrl
     * @type {Function}
     * @property getTileUrl_
     */
    this.getTileUrl_ = options.getTileUrl;


    /**
     * @type {Array.<HTMLElement>}
     * @private
     * @property divs_
     */
    this.divs_ = [];


    /**
     * Images created for each tile.
     *
     * @type {Array.<HTMLElement>}
     * @private
     * @property imgs_
     */
    this.imgs_ = [];


    /**
     * Loaded image elements.
     * A subset of this.imgs_
     *
     * @type {Array.<HTMLElement>}
     * @private
     * @property loadedImgs_
     */
    this.loadedImgs_ = [];


    /**
     * @type {number}
     * @private
     * @property zIndex_
     */
    this.zIndex_ = options.zIndex;


    /**
     * @type {number}
     * @private
     * @property opacity_
     */
    this.opacity_ = options.opacity;


    // Update our zIndex
    // whenever other ImageMapTypes are
    // added to the DOM.
    // This seems to be necessary for
    // gmaps to save our zIndex state.
    mapTypeEventHub.on('init', function(imageMapType) {
      if (imageMapType !== this) {
        // Reset our zIndex.
        this.setParentNodeZIndex_(this.zIndex_);
      }
    }, this);
  };

  /**
   * @override
   * @param {Object} coord
   * @param {number} zoom
   * @param {HTMLElement} ownerDocument
   * @return {HTMLElement}
   * @method getTile
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

      tileContainer.appendChild(img);

      this.imgs_.push(img);
    }

    this.setZIndex(this.zIndex_);

    // Keep track of the element,
    // so we can manipulate it later.
    this.divs_.push(tileContainer);


    // Google resets parent node styles
    // for all other map types when a new map
    // type is added.
    // This event will let other map types update their
    // styles to overcome google.
    if (!this.getParentNode_()) {
      mapTypeEventHub.trigger('init', this);
    }


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
   * @method getNormalizedCoord_
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
  };


  /**
   * @private
   * @param {HTMLElement} ownerDocument
   * @return {HTMLElement}
   * @method createTileContainer_
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
   * @method createTileImage_
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


  /**
   * @private
   * @method addLoadedImage_
   */
  ImageMapType.prototype.addLoadedImage_ = function(img) {
    this.loadedImgs_.push(img);
    if (this.imgs_.length === this.loadedImgs_.length) {
      // Note: avoid using the standard 'tilesloaded'
      // event. It seems that google will also trigger
      // this event on its own, maybe for different reasons.
      gmaps.event.trigger(this, 'load');
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
   * @method getParentNode_
   */
  ImageMapType.prototype.getParentNode_ = function() {
    if (this.parentNode_) { return this.parentNode_; }


    try {
      this.parentNode_ = this.divs_[0].parentNode.parentNode;
    }
    catch (e) {
      this.parentNode_ = null;
    }

    return this.parentNode_;
  };


  /**
   * @param {number} zIndex
   * @method setZIndex
   */
  ImageMapType.prototype.setZIndex = function(zIndex) {
    if (zIndex === this.zIndex_) { return; }

    // Save our new zIndex state.
    this.zIndex_ = zIndex;

    this.setParentNodeZIndex_(this.zIndex_);
  };


  /**
   * @private
   * @param {number} zIndex
   * @method setParentNodeZIndex_
   */
  ImageMapType.prototype.setParentNodeZIndex_ = function(zIndex) {
    var parentNode = this.getParentNode_();
    var parentNodeHasSameZIndex = parentNode && window.getComputedStyle(parentNode).zIndex === this.zIndex_;

    if (!parentNode || parentNodeHasSameZIndex) { return; }

    parentNode.style.zIndex = zIndex;
  };


  /**
   * @method releaseTile
   */
  ImageMapType.prototype.releaseTile = function(div) {
    var img = div.getElementsByTagName('img');
    var divIndex = this.divs_.indexOf(div);
    var imgIndex = this.imgs_.indexOf(img);
    var loadImgIndex = this.loadedImgs_.indexOf(img);

    this.divs_.splice(divIndex, 1);
    this.imgs_.splice(imgIndex, 1);
    this.loadedImgs_.splice(loadImgIndex, 1);
  };


  /**
   * @param {number} opacity
   * @method setOpacity
   */
  ImageMapType.prototype.setOpacity = function(opacity) {
    if (this.opacity_ === opacity) { return; }

    this.opacity_ = opacity;

    _.each(this.divs_, function(div) {
      if (window.getComputedStyle(div).opacity === this.opacity_) { return; }

      div.style.opacity = this.opacity_;
    }, this);
  };


  return ImageMapType;
});
